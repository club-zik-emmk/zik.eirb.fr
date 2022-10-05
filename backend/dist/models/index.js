"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModels = exports.ReservationUser = exports.User = exports.Reservation = exports.Disponibility = void 0;
const Disponibility_1 = require("./Disponibility");
Object.defineProperty(exports, "Disponibility", { enumerable: true, get: function () { return Disponibility_1.Disponibility; } });
const Reservation_1 = require("./Reservation");
Object.defineProperty(exports, "Reservation", { enumerable: true, get: function () { return Reservation_1.Reservation; } });
const ReservationUser_1 = require("./ReservationUser");
Object.defineProperty(exports, "ReservationUser", { enumerable: true, get: function () { return ReservationUser_1.ReservationUser; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
function initModels(sequelize) {
    Disponibility_1.Disponibility.initModel(sequelize);
    Reservation_1.Reservation.initModel(sequelize);
    User_1.User.initModel(sequelize);
    ReservationUser_1.ReservationUser.initModel(sequelize);
    //
    Reservation_1.Reservation.belongsTo(User_1.User, {
        as: "owner",
        foreignKey: "ownerId",
    });
    User_1.User.hasMany(Reservation_1.Reservation, {
        as: "ownedReservations",
        foreignKey: "ownerId",
    });
    //
    User_1.User.belongsToMany(Reservation_1.Reservation, {
        as: "reservations",
        through: {
            model: ReservationUser_1.ReservationUser,
        },
        foreignKey: "userId",
        otherKey: "reservationId",
        onDelete: "CASCADE"
    });
    Reservation_1.Reservation.belongsToMany(User_1.User, {
        as: "members",
        through: {
            model: ReservationUser_1.ReservationUser,
        },
        foreignKey: "reservationId",
        otherKey: "userId",
        onDelete: "CASCADE"
    });
    return {
        Disponibility: Disponibility_1.Disponibility,
        Reservation: Reservation_1.Reservation,
        User: User_1.User,
        ReservationUser: ReservationUser_1.ReservationUser
    };
}
exports.initModels = initModels;
