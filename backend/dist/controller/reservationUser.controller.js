"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const models_2 = require("../models");
const utils_1 = require("../utils");
const reservationUserController = {
    getUserByReservation,
    addUserToReservation,
    removeUserFromReservation
};
function getUserByReservation(req, res) {
    return models_1.Reservation.findByPk(req.params.id).then((reservation) => {
        if (reservation) {
            return models_2.ReservationUser.findAll({
                where: {
                    reservationId: reservation.id
                }
            }).then((reservationUsers) => {
                return (0, utils_1.success)(res, "Utilisateurs de la réservation", "RESERVATION/USERS", reservationUsers);
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
function addUserToReservation(req, res) {
    return models_1.Reservation.findByPk(req.body.resId).then((reservation) => {
        if (reservation) {
            return models_2.ReservationUser.create({
                reservationId: reservation.id,
                userId: req.body.userId
            }).then((reservationUser) => {
                return (0, utils_1.success)(res, "Utilisateur ajouté à la réservation avec succès !", "RESERVATION/USER_ADDED", reservationUser);
            }).catch((e) => {
                console.log(e);
                return (0, utils_1.error)(res, "Erreur lors de l'ajout de l'utilisateur à la réservation!", "RESERVATION/USER_ADD_FAILED");
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
function removeUserFromReservation(req, res) {
    return models_1.Reservation.findByPk(req.body.resId).then((reservation) => {
        if (reservation) {
            return models_2.ReservationUser.destroy({
                where: {
                    reservationId: reservation.id,
                    userId: req.body.userId
                }
            }).then((reservationUser) => {
                return (0, utils_1.success)(res, "Utilisateur retiré de la réservation avec succès !", "RESERVATION/USER_REMOVED", reservationUser);
            }).catch((e) => {
                console.log(e);
                return (0, utils_1.error)(res, "Erreur lors du retrait de l'utilisateur de la réservation!", "RESERVATION/USER_REMOVE_FAILED");
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
exports.default = reservationUserController;
