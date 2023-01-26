"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const models_2 = require("../models");
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const reservationController = {
    listAllReservations,
    getReservationById,
    createOrUpdateReservation,
    deleteReservationById,
    createAdminReservation,
};
async function listAllReservations(req, res) {
    let reservationsWithUsers = [];
    const reservations = await models_1.Reservation.findAll();
    // for each reservation, get the users associated and add them to the reservation object
    for (let reservation of reservations) {
        const reservationsUsers = await models_2.ReservationUser.findAll({
            where: {
                reservationId: reservation.id
            }
        });
        let users = [];
        reservationsUsers.forEach((reservationUser) => users.push(reservationUser.userId));
        reservationsWithUsers.push({
            id: reservation.id,
            title: reservation.title,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            ownerId: reservation.ownerId,
            users: users
        });
    }
    (0, utils_1.success)(res, "Réservations récupérées avec succès !", "RESERVATION/RETRIEVED", reservationsWithUsers);
}
function getReservationById(req, res) {
    return models_1.Reservation.findByPk(req.params.id).then((reservation) => {
        //get array of users in reservation and add it to reservation object
        if (reservation) {
            models_2.ReservationUser.findAll({
                where: {
                    reservationId: reservation.id
                }
            }).then((resUsers) => {
                // keep only the userId
                let userIds = resUsers.map((resUser) => {
                    return resUser.userId;
                });
                // create a new object with the reservation and the userIds
                let resWithUsers = {
                    id: reservation.id,
                    title: reservation.title,
                    startDate: reservation.startDate,
                    endDate: reservation.endDate,
                    ownerId: reservation.ownerId,
                    users: userIds
                };
                return (0, utils_1.success)(res, "Réservation", "RESERVATION/GET", resWithUsers);
            }).catch((e) => {
                console.log(e);
                return (0, utils_1.error)(res, "Erreur lors de la récupération des utilisateurs de la réservation!", "RESERVATION/USERS_GET_FAILED");
            });
        }
        else {
            return (0, utils_1.error)(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la récupération de la réservation", "RESERVATION/GET_FAILED");
    });
}
async function createOrUpdateReservation(req, res) {
    // check that title is a string and not too long
    if (typeof req.body.title !== "string" || req.body.title.length > 100) {
        return (0, utils_1.error)(res, "Le titre doit être une chaîne de caractères de maximum 100 caractères", "VALIDATION/TITLE_INVALID");
    }
    // check that startDate is a date in format "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(req.body.startDate)) {
        return (0, utils_1.error)(res, "La date de début doit être au format YYYY-MM-DD HH:mm:ss", "VALIDATION/START_DATE_INVALID");
    }
    // check that endDate is a date in format "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(req.body.endDate)) {
        return (0, utils_1.error)(res, "La date de fin doit être au format YYYY-MM-DD HH:mm:ss", "VALIDATION/END_DATE_INVALID");
    }
    // check that startDate is before endDate
    if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
        return (0, utils_1.error)(res, "La date de début doit être avant la date de fin", "VALIDATION/START_DATE_BEFORE_END_DATE");
    }
    try {
        const insertedReservation = await models_1.Reservation.create({
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            ownerId: req.session.user.id,
        });
        if (req.body.users) {
            for (let userId of req.body.users) {
                await models_2.ReservationUser.create({
                    reservationId: insertedReservation.id,
                    userId: userId
                });
            }
        }
        return (0, utils_1.success)(res, "Réservation créée avec succès !", "RESERVATION/CREATED", insertedReservation.id);
    }
    catch (e) {
        console.error(e);
        return (0, utils_1.error)(res, "Erreur lors de la création de la réservation!", "RESERVATION/CREATE_FAILED");
    }
}
// create admin reservation
async function createAdminReservation(req, res) {
    // check that title is a string and not too long
    if (typeof req.body.title !== "string" || req.body.title.length > 100) {
        return (0, utils_1.error)(res, "Le titre doit être une chaîne de caractères de maximum 100 caractères", "VALIDATION/TITLE_INVALID");
    }
    // check that startDate is a date in format "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(req.body.startDate)) {
        return (0, utils_1.error)(res, "La date de début doit être au format YYYY-MM-DD HH:mm:ss", "VALIDATION/START_DATE_INVALID");
    }
    // check that endDate is a date in format "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(req.body.endDate)) {
        return (0, utils_1.error)(res, "La date de fin doit être au format YYYY-MM-DD HH:mm:ss", "VALIDATION/END_DATE_INVALID");
    }
    // check that startDate is before endDate
    if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
        return (0, utils_1.error)(res, "La date de début doit être avant la date de fin", "VALIDATION/START_DATE_BEFORE_END_DATE");
    }
    // Find all reservations overlapping with the new one
    const overlappingReservations = await models_1.Reservation.findAll({
        where: {
            startDate: {
                [sequelize_1.Op.or]: {
                    [sequelize_1.Op.lte]: req.body.startDate,
                    [sequelize_1.Op.between]: [req.body.startDate, req.body.endDate]
                }
            },
            endDate: {
                [sequelize_1.Op.or]: {
                    [sequelize_1.Op.gte]: req.body.endDate,
                    [sequelize_1.Op.between]: [req.body.startDate, req.body.endDate]
                }
            }
        }
    });
    for (let reservation of overlappingReservations) {
        // Remove ReservationUsers rows associated with the reservation
        await models_2.ReservationUser.destroy({
            where: {
                reservationId: reservation.id
            }
        });
        // Remove the reservation
        await models_1.Reservation.destroy({
            where: {
                id: reservation.id
            }
        });
    }
    // Create new admin reservation that starts at startDate and ends at endDate
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const reservations = [];
    // if start and end are on the same day create only one reservation
    if (startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        reservations.push({
            title: req.body.title,
            startDate: startDate,
            endDate: endDate,
            ownerId: req.body.ownerId
        });
    }
    else {
        // Create a reservation for each day between startDate and endDate
        // the first reservation starts at startDate and ends at 22h30
        // the last reservation starts at 8h00 and ends at endDate
        // the other reservations start at 8h00 and end at 22h30
        // First reservation
        reservations.push({
            title: req.body.title,
            startDate: startDate,
            endDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 22, 30),
            ownerId: req.body.ownerId
        });
        // Last reservation
        reservations.push({
            title: req.body.title,
            startDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 8, 0),
            endDate: endDate,
            ownerId: req.body.ownerId
        });
        const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 8, 0);
        while (currentDate < endDate) {
            const reservation = {
                title: req.body.title,
                startDate: currentDate,
                endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 22, 30),
                ownerId: req.body.ownerId
            };
            reservations.push(reservation);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return models_1.Reservation.bulkCreate(reservations).then((reservations) => {
        return (0, utils_1.success)(res, "Réservations créées avec succès !", "RESERVATION/CREATED", reservations);
    }).catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la création des réservations!", "RESERVATION/CREATE_FAILED");
    });
}
async function deleteReservationById(req, res) {
    // @ts-ignore
    // check that the user is connected
    if (!req.session.user) {
        return (0, utils_1.error)(res, "Vous devez être connecté pour supprimer une réservation", "AUTH/NOT_AUTHENTICATED", 401);
    }
    const reservation = await models_1.Reservation.findByPk(req.params.id);
    if (!reservation) {
        return (0, utils_1.error)(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
    }
    const reservationUsers = await models_2.ReservationUser.findAll({
        where: {
            reservationId: req.params.id
        }
    }) || [];
    for (let reservationUser of reservationUsers) {
        await reservationUser.destroy();
    }
    // @ts-ignore
    if (reservation.ownerId === req.session.user.id || req.session.user.admin) {
        // @ts-ignore
        await reservation.destroy();
        // @ts-ignore
        return (0, utils_1.success)(res, "Réservation supprimée avec succès !", "RESERVATION/DELETED", reservation.id);
    }
    return (0, utils_1.error)(res, "Vous n'êtes pas autorisé à supprimer cette réservation", "RESERVATION/DELETE_NOT_ALLOWED", 403);
}
exports.default = reservationController;
