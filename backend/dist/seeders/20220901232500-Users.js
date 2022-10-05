"use strict";
module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert("Users", [{
                id: "jchabrier",
                firstName: "Julien",
                lastName: "Chabrier",
                group: "info",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "ngry",
                firstName: "Nicolas",
                lastName: "Gry",
                group: "info",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "aauville",
                firstName: "Asia",
                lastName: "Auville",
                group: "info",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "mhelias004",
                firstName: "Margot",
                lastName: "Helias",
                group: "info",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "lgaveriaux",
                firstName: "Lucas",
                lastName: "Gaveriaux",
                group: "info",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "avincent007",
                firstName: "Adrien",
                lastName: "Vincent",
                group: "elec",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "tbouhassoun",
                firstName: "Tahir",
                lastName: "Bouhassoun",
                group: "matmeca",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "mlegris",
                firstName: "Maya",
                lastName: "Legris",
                group: "telecom",
                year: 2024,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "nkegltourne",
                firstName: "Noémie",
                lastName: "Kegl--Tourneix",
                group: "telecom",
                year: 2025,
                admin: true,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "aboin",
                firstName: "Alexandre",
                lastName: "Boin",
                group: "info",
                year: 2024,
                admin: false,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "fmeignan",
                firstName: "Thalia",
                lastName: "Meignan",
                group: "telecom",
                year: 2023,
                admin: false,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "mamagnant",
                firstName: "Matthieu",
                lastName: "Magnant",
                group: "elec",
                year: 2023,
                admin: false,
                member: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    down: (queryInterface) => {
        return queryInterface.bulkDelete("Users", null, {});
    }
};
