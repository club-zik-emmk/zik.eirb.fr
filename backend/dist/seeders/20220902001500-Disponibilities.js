"use strict";
const holidays = [
    {
        "name": "Vacances de la Toussaint",
        "start": "2022-10-31",
        "end": "2022-11-06"
    },
    {
        "name": "Toussaint",
        "start": "2022-10-31",
    },
    {
        "name": "Armistice",
        "start": "2022-11-11",
    },
    {
        "name": "Vacances de Noël",
        "start": "2022-12-17",
        "end": "2023-01-02"
    },
    {
        "name": "Noël",
        "start": "2022-12-25",
    },
    {
        "name": "Nouvel an",
        "start": "2023-01-01",
    },
    {
        "name": "Vacances d'Hiver",
        "start": "2023-02-13",
        "end": "2023-02-19"
    },
    {
        "name": "Lundi de Pâques",
        "start": "2023-04-10",
    },
    {
        "name": "Vacances de Printemps",
        "start": "2023-04-15",
        "end": "2023-05-23"
    },
    {
        "name": "Fête du travail",
        "start": "2023-05-01",
    },
    {
        "name": "Victoire 1945",
        "start": "2023-05-08",
    },
    {
        "name": "Ascension",
        "start": "2023-05-18",
    },
    {
        "name": "Lundi de Pentecôte",
        "start": "2023-05-29",
    },
    {
        "name": "Fête nationale",
        "start": "2023-07-14",
    },
    {
        "name": "Assomption",
        "start": "2023-08-15",
    },
    {
        "name": "Vacances d'Été",
        "start": "2023-05-31",
        "end": "2023-09-01"
    }
];
const holidaysDisponibilities = [];
holidays.forEach(holiday => {
    const start = new Date(holiday.start);
    const end = holiday.end ? new Date(holiday.end) : null;
    const days = end ? [1, 2, 3, 4, 5, 6] : [new Date(start).getDay()];
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date(start);
        const openningTime = 8;
        const closingTime = day === 6 ? 19.5 : 22.5;
        const allowNoise = true;
        const priority = 2;
        holidaysDisponibilities.push({
            day,
            openningTime,
            closingTime,
            startDate,
            endDate,
            allowNoise,
            priority
        });
    }
});
module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert("Disponibilities", [
            {
                day: 1,
                openningTime: 8,
                closingTime: 22.5,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: true,
                priority: 0,
            },
            {
                day: 2,
                openningTime: 8,
                closingTime: 22.5,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: true,
                priority: 0,
            },
            {
                day: 3,
                openningTime: 8,
                closingTime: 22.5,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: true,
                priority: 0,
            },
            {
                day: 4,
                openningTime: 8,
                closingTime: 22.5,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: true,
                priority: 0,
            },
            {
                day: 5,
                openningTime: 8,
                closingTime: 22.5,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: true,
                priority: 0,
            },
            {
                day: 6,
                openningTime: 8,
                closingTime: 19.5,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: true,
                priority: 0,
            },
            {
                day: 1,
                openningTime: 8,
                closingTime: 12.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 2,
                openningTime: 8,
                closingTime: 12.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 3,
                openningTime: 8,
                closingTime: 12.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 4,
                openningTime: 8,
                closingTime: 12.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 5,
                openningTime: 8,
                closingTime: 12.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 1,
                openningTime: 14,
                closingTime: 18.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 2,
                openningTime: 14,
                closingTime: 18.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 3,
                openningTime: 14,
                closingTime: 18.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 4,
                openningTime: 14,
                closingTime: 18.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
            {
                day: 5,
                openningTime: 14,
                closingTime: 18.25,
                startDate: new Date("2022-08-22"),
                endDate: new Date("2023-07-29"),
                allowNoise: false,
                priority: 1,
            },
        ].concat(holidaysDisponibilities), {});
    },
    down: (queryInterface) => {
        return queryInterface.bulkDelete("Disponibilities", null, {});
    }
};
