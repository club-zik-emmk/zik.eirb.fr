"use strict";

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert("Reservations", [
            {
                ownerId: "fmeignan",
                title: "Thalia",
                startDate: new Date("2022-08-22 17:00:00"),
                endDate: new Date("2022-08-22 18:00:00"),
            },
            {
                ownerId: "fmeignan",
                title: "Thalia",
                startDate: new Date("2022-08-24 21:00:00"),
                endDate: new Date("2022-08-24 22:00:00"),
            },
            {
                ownerId: "fmeignan",
                title: "Thalia",
                startDate: new Date("2022-08-25 17:00:00"),
                endDate: new Date("2022-08-25 19:00:00"),
            },
            {
                ownerId: "fmeignan",
                title: "Thalia",
                startDate: new Date("2022-08-27 17:00:00"),
                endDate: new Date("2022-08-27 18:00:00"),
            },
            {
                ownerId: "mamagnant",
                title: "matthieu m",
                startDate: new Date("2022-08-24 17:00:00"),
                endDate: new Date("2022-08-24 19:00:00"),
            },
        ], {});
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete("Reservations", null, {});
    }
};
