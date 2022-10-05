"use strict";
const DataTypes = require("sequelize").DataTypes;
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("Disponibilities", {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            day: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            openningTime: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            closingTime: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            allowNoise: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            priority: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("Disponibilities");
    }
};
