import {Moment} from "moment";

export type Disponibility = {
    id: number;
    day: number;
    openningTime: Moment;
    closingTime: Moment;
    startDate: Moment;
    endDate: Moment;
    allowNoise: boolean;
    priority: number;
    createdAt: Moment | null;
    updatedAt: Moment | null;
};

export type Reservation = {
    id: number,
    ownerId: string,
    title: string,
    startDate: Moment,
    endDate: Moment,
    createdAt: Moment | null,
    updatedAt: Moment | null
};

export type Day = {
    disponibilities: Disponibility[],
    reservations: Reservation[],
    dayIndex: number,
    dayName: string,
    isoString: string,
};

export interface IPlanningLogic {
    getCurrentDay(callback: (day: Day) => void): Day,
    getNextDay(callback: (day: Day) => void): Day,
    getPreviousDay(callback: (day: Day) => void): Day,
    getNextWeek(callback: (days: Day[]) => void): void,
    getPreviousWeek(callback: (days: Day[]) => void): void,
}