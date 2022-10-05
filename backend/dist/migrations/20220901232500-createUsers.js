"use strict";
const DataTypes = require("sequelize").DataTypes;
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("Users", {
            id: {
                type: DataTypes.STRING(100),
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            firstName: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            lastName: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            displayName: {
                type: DataTypes.STRING(200),
                validate: {
                    notEmpty: true
                }
            },
            group: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            year: {
                type: DataTypes.SMALLINT.UNSIGNED
            },
            admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            member: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
        await queryInterface.dropTable("Users");
    }
};
