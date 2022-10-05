import type { Sequelize } from "sequelize";

import { Disponibility } from "./Disponibility";
import { Reservation } from "./Reservation";
import { ReservationUser } from "./ReservationUser";
import { User } from "./User";

export {
    Disponibility,
    Reservation,
    User,
    ReservationUser
}

export function initModels(sequelize: Sequelize) {
    Disponibility.initModel(sequelize);
    Reservation.initModel(sequelize);
    User.initModel(sequelize);
    ReservationUser.initModel(sequelize);

    //

    Reservation.belongsTo(User, {
        as: "owner",
        foreignKey: "ownerId",
    });

    User.hasMany(Reservation, {
        as: "ownedReservations",
        foreignKey: "ownerId",
    });

    //

    User.belongsToMany(Reservation, {
        as: "reservations",
        through: {
            model: ReservationUser,
        },
        foreignKey: "userId",
        otherKey: "reservationId",
        onDelete: "CASCADE"
    });

    Reservation.belongsToMany(User, {
        as: "members",
        through: {
            model: ReservationUser,
        },
        foreignKey: "reservationId",
        otherKey: "userId",
        onDelete: "CASCADE"
    });

    return {
        Disponibility,
        Reservation,
        User,
        ReservationUser
    }
}


