"use strict";
const DataTypes = require("sequelize").DataTypes;
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("Reservations", {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
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
            ownerId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("Reservations");
    }
};
