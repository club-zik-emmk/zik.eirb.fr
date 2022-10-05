"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationUser = void 0;
const sequelize_1 = require("sequelize");
class ReservationUser extends sequelize_1.Model {
    static initModel(sequelize) {
        ReservationUser.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE
            },
            reservationId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED
            },
            userId: {
                type: sequelize_1.DataTypes.STRING(100)
            }
        }, {
            sequelize
        });
        return ReservationUser;
    }
}
exports.ReservationUser = ReservationUser;
