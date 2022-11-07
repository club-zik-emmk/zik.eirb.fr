const DataTypes = require("sequelize").DataTypes;

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("ReservationUsers", {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE
            },
            reservationId: {
                type: DataTypes.INTEGER.UNSIGNED
            },
            userId: {
                type: DataTypes.STRING(100)
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("ReservationUsers");
    }
};
