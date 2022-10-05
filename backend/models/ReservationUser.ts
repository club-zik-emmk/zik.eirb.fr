import {
    Association as SequelizeAssociation,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    CreationOptional,
    DataTypes,
    InferCreationAttributes,
    InferAttributes,
    Model,
    NonAttribute,
    Sequelize
} from "sequelize";
import type { Reservation } from "./Reservation";
import type { User } from "./User";

type ReservationUserAssociations = "reservation" | "user"

export class ReservationUser extends Model<
    InferAttributes<ReservationUser, { omit: ReservationUserAssociations }>,
    InferCreationAttributes<ReservationUser, { omit: ReservationUserAssociations }>
> {
    declare id: CreationOptional<number>;
    declare reservationId: number;
    declare userId: string;
    
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    
    // ReservationUser belongsTo Reservation
    declare reservation?: NonAttribute<Reservation>;
    declare getReservation: BelongsToGetAssociationMixin<Reservation>;
    declare setReservation: BelongsToSetAssociationMixin<Reservation, number>;
    declare createReservation: BelongsToCreateAssociationMixin<Reservation>;

    // ReservationUser belongsTo User
    declare user?: NonAttribute<User>;
    declare getUser: BelongsToGetAssociationMixin<User>;
    declare setUser: BelongsToSetAssociationMixin<User, string>;
    declare createUser: BelongsToCreateAssociationMixin<User>;

    declare static associations: {
        reservation: SequelizeAssociation<ReservationUser, Reservation>,
        user: SequelizeAssociation<ReservationUser, User>
    };

    static initModel(sequelize: Sequelize): typeof ReservationUser {
        ReservationUser.init({
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
        }, {
            sequelize
        });

        return ReservationUser;
    }
}