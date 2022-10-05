import {
    CreationOptional,
    DataTypes,
    InferCreationAttributes,
    InferAttributes,
    Model,
    Sequelize,
    NonAttribute,
    Association,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyCountAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyCountAssociationsMixin
} from "sequelize";

import { Reservation } from "./Reservation";

type UserAssociations = "ownedReservations" | "reservations";

export class User extends Model<
    InferAttributes<User, { omit: UserAssociations}>,
    InferCreationAttributes<User, { omit: UserAssociations}>
> {
    declare id: string;
    declare firstName: string;
    declare lastName: string;
    declare displayName: string | null;
    declare fullName: CreationOptional<string>;
    declare admin: CreationOptional<boolean>;
    declare member: CreationOptional<boolean>;

    declare group: string;
    declare year: number;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // User hasMany Reservation (as OwnedReservations)
    declare ownedReservations?: NonAttribute<Reservation[]>;
    declare getOwnedReservations: HasManyGetAssociationsMixin<Reservation>;
    declare setOwnedReservations: HasManySetAssociationsMixin<Reservation, number>;
    declare addOwnedReservation: HasManyAddAssociationMixin<Reservation, number>;
    declare addOwnedReservations: HasManyAddAssociationsMixin<Reservation, number>;
    declare createOwnedReservation: HasManyCreateAssociationMixin<Reservation>;
    declare removeOwnedReservation: HasManyRemoveAssociationMixin<Reservation, number>;
    declare removeOwnedReservations: HasManyRemoveAssociationsMixin<Reservation, number>;
    declare hasOwnedReservation: HasManyHasAssociationMixin<Reservation, number>;
    declare hasOwnedReservations: HasManyHasAssociationsMixin<Reservation, number>;
    declare countOwnedReservations: HasManyCountAssociationsMixin;

    // User belongsToMany Reservation (as Reservations)
    declare reservations?: NonAttribute<Reservation[]>;
    declare getReservations: BelongsToManyGetAssociationsMixin<Reservation>;
    declare setReservations: BelongsToManySetAssociationsMixin<Reservation, number>;
    declare addReservation: BelongsToManyAddAssociationMixin<Reservation, number>;
    declare addReservations: BelongsToManyAddAssociationsMixin<Reservation, number>;
    declare createReservation: BelongsToManyCreateAssociationMixin<Reservation>;
    declare removeReservation: BelongsToManyRemoveAssociationMixin<Reservation, number>;
    declare removeReservations: BelongsToManyRemoveAssociationsMixin<Reservation, number>;
    declare hasReservation: BelongsToManyHasAssociationMixin<Reservation, number>;
    declare hasReservations: BelongsToManyHasAssociationsMixin<Reservation, number>;
    declare countReservations: BelongsToManyCountAssociationsMixin;

    declare static associations: {
        ownedReservations: Association<User, Reservation>;
        reservations: Association<User, Reservation>;
    };

    static initModel(sequelize: Sequelize): typeof User {
        User.init({
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
            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.displayName ? this.displayName : `${this.firstName} ${this.lastName}`;
                },
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
        }, {
            sequelize,
        });

        return User;
    }
}

