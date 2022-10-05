"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static initModel(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.STRING(100),
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            firstName: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            lastName: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            displayName: {
                type: sequelize_1.DataTypes.STRING(200),
                validate: {
                    notEmpty: true
                }
            },
            fullName: {
                type: sequelize_1.DataTypes.VIRTUAL,
                get() {
                    return this.displayName ? this.displayName : `${this.firstName} ${this.lastName}`;
                },
            },
            group: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            year: {
                type: sequelize_1.DataTypes.SMALLINT.UNSIGNED
            },
            admin: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            member: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
        return User;
    }
}
exports.User = User;
