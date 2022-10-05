export type Disponibility = {
    id: number;
    day: number;
    openningTime: Date;
    closingTime: Date;
    startDate: Date;
    endDate: Date;
    allowNoise: boolean;
    priority: number;
    createdAt: Date | null;
    updatedAt: Date | null;
};

export type Reservation = {
    id: number,
    ownerId: string,
    title: string,
    startDate: Date,
    endDate: Date,
    createdAt: Date | null,
    updatedAt: Date | null
};

export type Day = {
    disponibilities: Disponibility[],
    reservations: Reservation[],
    dayIndex: number,
    dayName: string,
};

export interface IPlanningLogic {
    getCurrentDay(callback: (day: Day) => void): Day,
    getNextDay(callback: (day: Day) => void): Day,
    getPreviousDay(callback: (day: Day) => void): Day,
    getNextWeek(callback: (days: Day[]) => void): void,
    getPreviousWeek(callback: (days: Day[]) => void): void,
}