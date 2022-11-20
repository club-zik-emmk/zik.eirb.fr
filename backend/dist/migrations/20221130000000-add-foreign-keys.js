"use strict";
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.addConstraint("Reservations", {
            fields: ["ownerId"],
            type: "foreign key",
            name: "Reservations_ownerId_fkey",
            references: {
                table: "Users",
                field: "id"
            }
        });
        await queryInterface.addConstraint("ReservationUsers", {
            fields: ["userId"],
            type: "foreign key",
            name: "ReservationUsers_userId_fkey",
            references: {
                table: "Users",
                field: "id"
            }
        });
        await queryInterface.addConstraint("ReservationUsers", {
            fields: ["reservationId"],
            type: "foreign key",
            name: "ReservationUsers_reservationId_fkey",
            references: {
                table: "Reservations",
                field: "id"
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeConstraint("Reservations", "Reservations_ownerId_fkey");
        await queryInterface.removeConstraint("ReservationUsers", "ReservationUsers_userId_fkey");
        await queryInterface.removeConstraint("ReservationUsers", "ReservationUsers_reservationId_fkey");
    }
};
