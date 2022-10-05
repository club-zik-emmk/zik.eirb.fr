import {Day, Disponibility, IPlanningLogic, Reservation} from "./types";
import axiosInstance from "./axiosInstance";
import {getWeekNumber, dayIndexToDayName, monthIndexToMonthName} from "./utils";


class PlanningLogicManager implements IPlanningLogic {
    private currentDay: number;
    private currentWeek: Date;

    private allDisponibilities: Disponibility[];
    private allReservations: Reservation[];

    private weekDisponibilities: { [key: number]: Disponibility[] } = {};
    private weekReservations: { [key: number]: Reservation[] } = {};

    /**
     * Fetch all the disponibilities stored in the database
     */
    async refreshDisponibilities() {
        const response = await axiosInstance.get("api/v1/disponibilities");

        this.allDisponibilities = response.data.data.map((disponibility: any) => {
            return {
                ...disponibility,
                startDate: new Date(disponibility.startDate), // Parse starting date
                endDate: new Date(disponibility.endDate), // Parse ending date
                // OpenningTime is set as a string like 8.50 for 8h30 and 7.25 for 7h15
                // We need to convert it to a Date object
                openningTime: new Date(0, 0, 0, Math.floor(disponibility.openningTime), (disponibility.openningTime % 1) * 60),
                // Same for closing time
                closingTime: new Date(0, 0, 0, Math.floor(disponibility.closingTime), (disponibility.closingTime % 1) * 60),
            };
        });
    }

    /**
     * Fetch all the reservations stored in the database
     */
    async refreshReservations() {
        const response = await axiosInstance.get("api/v1/reservations");

        this.allReservations = response.data.data.map((reservation: any) => {
            return {
                ...reservation,
                startDate: new Date(reservation.startDate), // Parse starting date
                endDate: new Date(reservation.endDate), // Parse ending date
            };
        });
    }

    async refreshWeek() {
        await this.refreshDisponibilities();

        // Only keep the disponibilities that are in the current week
        const filteredDisponibilities = this.allDisponibilities.filter((disponibility) => {
            return disponibility.startDate.getUTCFullYear() === this.currentWeek.getUTCFullYear() &&
                disponibility.startDate.getUTCMonth() === this.currentWeek.getUTCMonth() &&
                getWeekNumber(disponibility.startDate) === getWeekNumber(this.currentWeek);
        });

        // Reduce in map of day index to disponibilities
        this.weekDisponibilities = filteredDisponibilities.reduce((acc, disponibility) => {
            if (!acc[disponibility.day]) {
                acc[disponibility.day] = [];
            }
            acc[disponibility.day].push(disponibility);
            return acc;
        }, {});

        await this.refreshReservations()

        // Only keep this week's reservations
        const filteredReservations = this.allReservations.filter((reservation) => {
            // Check that reservation is in the current week
            return reservation.startDate.getUTCFullYear() === this.currentWeek.getUTCFullYear()
                && reservation.endDate.getUTCMonth() === this.currentWeek.getUTCMonth()
                // Check that the week number is the same
                && getWeekNumber(reservation.startDate) === getWeekNumber(this.currentWeek);
        });

        // Reduce in map of day index to reservations
        this.weekReservations = filteredReservations.reduce((acc, reservation) => {
            if (!acc[reservation.startDate.getDay()]) {
                acc[reservation.startDate.getDay()] = [];
            }
            acc[reservation.startDate.getDay()].push(reservation);
            return acc;
        }, {});
    }

    constructor() {
        // Set to today
        // this.currentWeek = new Date();
        // this.currentDay = this.currentWeek.getDay();

        // Current week to 22 august 2022
        this.currentWeek = new Date(2022, 7, 22);
        this.currentDay = this.currentWeek.getDay();

        this.allDisponibilities = [];
        this.allReservations = [];
    }

    private dayFromContext(dayIndex: number, dateContext: Date): Day {
        return {
            disponibilities: this.weekDisponibilities[dayIndex] || [],
            reservations: this.weekReservations[dayIndex] || [],
            dayIndex,
            dayName: `${dayIndexToDayName[dayIndex]} ${dateContext.getDate()} ${monthIndexToMonthName[dateContext.getMonth()]}`,
        };
    }

    /**
     * Get the disponibilities and reservations for the current day
     */
    getCurrentDay(): Day {
        return this.dayFromContext(this.currentDay, this.currentWeek);
    }

    /**
     * Get the disponibilities and reservations for the next day
     */
    getNextDay(): Day {
        this.currentWeek.setDate(this.currentWeek.getDate() + 1);
        this.currentDay = (this.currentDay + 1) % 7;

        return this.getCurrentDay();
    }

    /**
     * Get the disponibilities and reservations for the previous day
     */
    getPreviousDay(): Day {
        this.currentWeek.setDate(this.currentWeek.getDate() - 1);
        this.currentDay = (((this.currentDay - 1) % 7) + 7) % 7; // I love javascript

        return this.getCurrentDay();
    }

    private async gatherWeekToArray(): Promise<Day[]> {
        const tmpDate = new Date(this.currentWeek);
        await this.refreshWeek();

        const days: Day[] = [];
        for (let i = 0; i < 7; i++) {
            days.push(this.dayFromContext(i, tmpDate));

            tmpDate.setDate(tmpDate.getDate() + 1);
        }

        return days;
    }

    /**
     * Returns the next week, parsed by days
     */
    async getNextWeek(): Promise<Day[]> {
        // Jump to day 0 of next week
        this.currentWeek.setDate(this.currentWeek.getDate() + 7 - this.currentDay);

        return await this.gatherWeekToArray();
    }

    async getPreviousWeek(): Promise<Day[]> {
        // Jump to day 0 of previous week
        this.currentWeek.setDate(this.currentWeek.getDate() - 7 - this.currentDay);

        return await this.gatherWeekToArray();
    }
}

const planningLogicManager = new PlanningLogicManager();

export default planningLogicManager;