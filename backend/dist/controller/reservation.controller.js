"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const models_2 = require("../models");
const utils_1 = require("../utils");
const reservationController = {
    listAllReservations,
    getReservationById,
    createOrUpdateReservation,
    deleteReservationById
};
function listAllReservations(req, res) {
    return models_1.Reservation.findAll().then((reservations) => {
        return (0, utils_1.success)(res, "Liste des réservations", "RESERVATION/LIST", reservations);
    }).catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la récupération de la liste des réservations", "RESERVATION/LIST_FAILED");
    });
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
                    reservation: reservation,
                    userIds: userIds
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
    // Create local user object from request body
    const reservation = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        // @ts-ignore
        ownerId: req.session.user.id,
    };
    return models_1.Reservation.create(reservation)
        .then((resa) => {
        // if users is defined
        if (req.body.users) {
            // create reservationUsers per user
            req.body.users.forEach((user) => {
                models_2.ReservationUser.create({
                    reservationId: resa.id,
                    userId: user.id
                });
            });
            return (0, utils_1.success)(res, "Réservation créée avec succès !", "RESERVATION/CREATED", resa.id);
        }
    }).catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la création de la réservation!", "RESERVATION/CREATE_FAILED");
    });
}
function deleteReservationById(req, res) {
    // @ts-ignore
    // check that the user is connected
    if (!req.session.user) {
        return (0, utils_1.error)(res, "Vous devez être connecté pour supprimer une réservation", "AUTH/NOT_AUTHENTICATED", 401);
    }
    // Check that the user is the owner of the reservation or an admin
    return models_1.Reservation.findByPk(req.params.id).then((reservation) => {
        if (reservation) {
            // @ts-ignore
            if (reservation.ownerId === req.session.user.id || req.session.user.isAdmin) {
                return reservation.destroy().then(() => {
                    return (0, utils_1.success)(res, "Réservation supprimée avec succès !", "RESERVATION/DELETED", reservation.id);
                }).catch((e) => {
                    console.log(e);
                    return (0, utils_1.error)(res, "Erreur lors de la suppression de la réservation", "RESERVATION/DELETE_FAILED");
                });
            }
            else {
                return (0, utils_1.error)(res, "Vous n'êtes pas autorisé à supprimer cette réservation", "RESERVATION/DELETE_NOT_ALLOWED", 403);
            }
        }
        else {
            return (0, utils_1.error)(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return (0, utils_1.error)(res, "Erreur lors de la suppression de la réservation", "RESERVATION/DELETE_FAILED");
    });
}
exports.default = reservationController;
