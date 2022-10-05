import {
    CreationOptional,
    DataTypes,
    InferCreationAttributes,
    InferAttributes,
    Model,
    Sequelize
} from "sequelize";

export class Disponibility extends Model<
    InferAttributes<Disponibility>,
    InferCreationAttributes<Disponibility>
> {
    declare id: CreationOptional<number>;
    // {0 : "Dimanche", 1 : "Lundi", 2 : Mardi, 3 : "Mercredi", 4 : "Jeudi", 5 : "Vendredi", 6 : "Samedi"}
    declare day: number;
    // 8.5 = 8h30, 8.75 = 8h45
    declare openningTime: number;
    declare closingTime: number;
    declare startDate: Date;
    declare endDate: Date;
    declare allowNoise: boolean;
    declare priority: number;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare static associations: {};

    static initModel(sequelize: Sequelize): typeof Disponibility {
        Disponibility.init({
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
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
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
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE
            },
        }, {
            sequelize,
        });

        return Disponibility;
    }
}

