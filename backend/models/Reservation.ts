import {
    CreationOptional,
    DataTypes,
    InferCreationAttributes,
    InferAttributes,
    Model,
    Sequelize,
    Association,
    NonAttribute,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
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

import { User } from "./User";

type ReservationAssociations = "owner" | "members";

export class Reservation extends Model<
    InferAttributes<Reservation, { omit: ReservationAssociations }>,
    InferCreationAttributes<Reservation, { omit: ReservationAssociations }>
> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare startDate: Date;
    declare endDate: Date;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare ownerId: string;

    // Reservation belongsTo User (as Owner)
    declare owner?: NonAttribute<User>;
    declare getOwner: BelongsToGetAssociationMixin<User>;
    declare setOwner: BelongsToSetAssociationMixin<User, string>;
    declare createOwner: BelongsToCreateAssociationMixin<User>;

    // Reservation belongsToMany User (as Members)
    declare members?: NonAttribute<User[]>;
    declare getMembers: BelongsToManyGetAssociationsMixin<User>;
    declare setMembers: BelongsToManySetAssociationsMixin<User, string>;
    declare addMember: BelongsToManyAddAssociationMixin<User, string>;
    declare addMembers: BelongsToManyAddAssociationsMixin<User, string>;
    declare createMember: BelongsToManyCreateAssociationMixin<User>;
    declare removeMember: BelongsToManyRemoveAssociationMixin<User, string>;
    declare removeMembers: BelongsToManyRemoveAssociationsMixin<User, string>;
    declare hasMember: BelongsToManyHasAssociationMixin<User, string>;
    declare hasMembers: BelongsToManyHasAssociationsMixin<User, string>;
    declare countMembers: BelongsToManyCountAssociationsMixin;

    declare static associations: {
        owner: Association<Reservation, User>;
        members: Association<Reservation, User>;
    };

    static initModel(sequelize: Sequelize): typeof Reservation {
        Reservation.init({
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
        }, {
            sequelize,
        });

        return Reservation;
    }
}

