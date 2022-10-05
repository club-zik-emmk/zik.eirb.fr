"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disponibility = void 0;
const sequelize_1 = require("sequelize");
class Disponibility extends sequelize_1.Model {
    static initModel(sequelize) {
        Disponibility.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            day: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            openningTime: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            closingTime: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            startDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            allowNoise: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
            },
            priority: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE
            },
        }, {
            sequelize,
        });
        return Disponibility;
    }
}
exports.Disponibility = Disponibility;
