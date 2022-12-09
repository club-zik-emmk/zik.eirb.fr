import {Day, Disponibility, Reservation} from "./types";
import axiosInstance from "./axiosInstance";
import {dayIndexToDayName, monthIndexToMonthName} from "./utils";
import moment, {Moment} from "moment";
import store from "./store";


class ExperimentalPlanningLogicManager {
    private currentWeek: Moment;

    private allDisponibilities: Disponibility[];
    private allReservations: Reservation[];

    // Index 0 of window is the week before the current week
    // Index 1 of window is the current week
    // Index 2 of window is the week after the current week
    private reservationWindow: Array<{ [key: number]: Reservation[] }> = new Array(3);
    private disponibilitiesWindow: Array<{ [key: number]: Disponibility[] }> = new Array(3);

    private weekDisponibilities: { [key: number]: Disponibility[] } = {};
    private weekReservations: { [key: number]: Reservation[] } = {};

    /**
     * Fetch all the disponibilities stored in the database
     */
    async refreshDisponibilities() {
        const response = await axiosInstance.get("api/v1/disponibilities");

        this.allDisponibilities = response.data.data.map((disponibility: any) => {
            // Parse starting date but set the time to 00:00:00
            const startDate = moment(new Date(disponibility.startDate)).startOf("day");

            // Parse ending date but set the time to 23:59:59
            const endDate = moment(new Date(disponibility.endDate)).endOf("day");

            return {
                ...disponibility,
                startDate: startDate,
                endDate: endDate,
                // OpenningTime is set as a string like 8.50 for 8h30 and 7.25 for 7h15
                // We need to convert it to a Date object
                openningTime: moment(new Date(0, 0, 0, Math.floor(disponibility.openningTime), (disponibility.openningTime % 1) * 60)),
                // Same for closing time
                closingTime: moment(new Date(0, 0, 0, Math.floor(disponibility.closingTime), (disponibility.closingTime % 1) * 60)),
            };
        });
    }

    /**
     * Fetch all the reservations stored in the database
     */
    async refreshReservations() {
        const response = await axiosInstance.get("api/v1/reservations");

        this.allReservations = response.data.data.map((reservation: any) => {
            // Parse starting date but set the time to 00:00:00
            const startDate = moment(reservation.startDate);

            // Parse ending date but set the time to 23:59:59
            const endDate = moment(reservation.endDate);

            return {
                ...reservation,
                startDate: startDate,
                endDate: endDate,
            };
        });
    }

    async refreshWeek(weekIndex = 1) {
        // Cache refresh
        if (
            store.state.lastCacheRefresh === -1
            || moment().diff(store.state.lastCacheRefresh, "minutes") > 5
        ) {
            console.log("ExperimentalPlanningLogicManager: refreshWeek(): Refreshing cache");
            await this.refreshDisponibilities();
            await this.refreshReservations();

            store.commit("setLastCacheRefresh", moment());

            for (let weekIndex of [1, 2, 0]) {
                await this.refreshWeek(weekIndex);
            }

            return;
        }

        const weekClone = this.currentWeek.clone();

        switch (weekIndex) {
            case 0:
                weekClone.subtract(1, "weeks");
                break;
            case 2:
                weekClone.add(1, "weeks");
                break;
        }

        console.log("ExperimentalPlanningLogicManager: refreshWeek(): weekClone: ", weekClone.format("YYYY-MM-DD"));
        console.log("ExperimentalPlanningLogicManager: refreshWeek(): allDisponibilities: ", this.allDisponibilities);

        // Only keep the disponibilities that are in the current week
        this.disponibilitiesWindow[weekIndex] = this.allDisponibilities
            .filter((disponibility) => {
                return weekClone.isBetween(disponibility.startDate, disponibility.endDate);
            })
            .reduce((acc, disponibility) => {
                if (!acc[disponibility.day]) {
                    acc[disponibility.day] = [];
                }
                acc[disponibility.day].push(disponibility);
                return acc;
            }, {});

        console.log("ExperimentalPlanningLogicManager: refreshWeek(): filteredDisponibilities: ", this.allDisponibilities.filter((disponibility) => weekClone.isSame(disponibility.startDate, "week")));

        // Only keep this week's reservations
        this.reservationWindow[weekIndex] = this.allReservations
            .filter((reservation) => {
                return weekClone.isoWeek() === reservation.startDate.isoWeek()
                    && weekClone.year() === reservation.startDate.year();
            })
            .reduce((acc, reservation) => {
                if (!acc[reservation.startDate.day()]) {
                    acc[reservation.startDate.day()] = [];
                }
                acc[reservation.startDate.day()].push(reservation);
                return acc;
            }, {});
    }

    constructor() {
        this.allDisponibilities = [];
        this.allReservations = [];
    }

    /**
     * Get the disponibilities and reservations for the current day
     */
    getCurrentDay(): Day {
        const dayIndex = this.currentWeek.days();

        console.log("ExperimentalPlanningLogicManager: getCurrentDay(): disponibilitiesWindow[1]: ", this.disponibilitiesWindow[1]);

        return {
            disponibilities: this.disponibilitiesWindow[1][dayIndex],
            reservations: this.reservationWindow[1][dayIndex],
            dayIndex: this.currentWeek.date(),
            dayName: `${dayIndexToDayName[dayIndex]} ${this.currentWeek.date()} ${monthIndexToMonthName[this.currentWeek.month()]}`,
            isoString: this.currentWeek.toISOString(),
        };
    }

    /**
     * Get the disponibilities and reservations for the next day
     */
    async getNextDay(): Promise<Day> {
        const previousWeek = this.currentWeek.isoWeek();

        this.currentWeek.add(1, "days");

        // If the week has changed, we need to refresh the disponibilities and reservations
        if (previousWeek !== this.currentWeek.isoWeek()) {
            // Shift window to the left
            this.disponibilitiesWindow[0] = this.disponibilitiesWindow[1];
            this.disponibilitiesWindow[1] = this.disponibilitiesWindow[2];

            this.reservationWindow[0] = this.reservationWindow[1];
            this.reservationWindow[1] = this.reservationWindow[2];

            await this.refreshWeek(2);
        }

        return this.getCurrentDay();
    }

    async getNextWeek(): Promise<void> {
        this.currentWeek.add(1, "weeks");

        // Shift window to the left
        this.disponibilitiesWindow[0] = this.disponibilitiesWindow[1];
        this.disponibilitiesWindow[1] = this.disponibilitiesWindow[2];

        this.reservationWindow[0] = this.reservationWindow[1];
        this.reservationWindow[1] = this.reservationWindow[2];

        await this.refreshWeek(2);
    }

    async getPreviousWeek(): Promise<void> {
        this.currentWeek.subtract(1, "weeks");

        // Shift window to the right
        this.disponibilitiesWindow[2] = this.disponibilitiesWindow[1];
        this.disponibilitiesWindow[1] = this.disponibilitiesWindow[0];

        this.reservationWindow[2] = this.reservationWindow[1];
        this.reservationWindow[1] = this.reservationWindow[0];

        await this.refreshWeek(0);
    }

    /**
     * Get the disponibilities and reservations for the previous day
     */
    async getPreviousDay(): Promise<Day> {
        const previousWeek = this.currentWeek.isoWeek();

        this.currentWeek.subtract(1, "days");

        // If the week has changed, we need to refresh the disponibilities and reservations
        if (previousWeek !== this.currentWeek.isoWeek()) {
            // Shift window to the right
            this.disponibilitiesWindow[2] = this.disponibilitiesWindow[1];
            this.disponibilitiesWindow[1] = this.disponibilitiesWindow[0];

            this.reservationWindow[2] = this.reservationWindow[1];
            this.reservationWindow[1] = this.reservationWindow[0];

            await this.refreshWeek(0);
        }

        return this.getCurrentDay();
    }

    async setWeek(date: Moment) {
        this.currentWeek = date.clone();

        console.log("ExperimentalPlanningLogicManager: setWeek(): date: ", date);

        for (let weekIndex of [1, 2, 0]) {
            console.log("ExperimentalPlanningLogicManager: setWeek(): weekIndex: ", weekIndex);
            await this.refreshWeek(weekIndex);
        }
    }

    resetToToday(): void {
        // this.currentWeek = moment();
        this.currentWeek = moment(new Date(2022, 7, 25, 12));
    }

    getReservations(weekIndex = 1): { [key: number]: Reservation[] } {
        return this.reservationWindow[weekIndex];
    }

    getCurrentWeek(): Moment {
        return this.currentWeek;
    }
}

const experimentalPlanningLogicManager = new ExperimentalPlanningLogicManager();

export default experimentalPlanningLogicManager;