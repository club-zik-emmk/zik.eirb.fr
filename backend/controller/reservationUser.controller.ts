import {Request, Response} from "express";
import {Reservation} from "../models";
import { ReservationUser } from "../models";
import {error, success} from "../utils";

const reservationUserController = {
    getUserByReservation,
    addUserToReservation,
    removeUserFromReservation
};

function getUserByReservation(req: Request, res: Response) {
    return Reservation.findByPk(req.params.id).then((reservation) => {
        if (reservation) {
            return ReservationUser.findAll({
                where: {
                    reservationId: reservation.id
                }
            }).then((reservationUsers) => {
                return success(res, "Utilisateurs de la réservation", "RESERVATION/USERS", reservationUsers);
            }).catch((e) => {
                console.log(e);
                return error(res, "Erreur lors de la récupération des utilisateurs de la réservation!", "RESERVATION/USERS_GET_FAILED");
            });
        } else {
            return error(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la récupération de la réservation", "RESERVATION/GET_FAILED");
    });
}


function addUserToReservation(req: Request, res: Response) {
    return Reservation.findByPk(req.body.resId).then((reservation) => {
        if (reservation) {
            return ReservationUser.create({
                reservationId: reservation.id,
                userId: req.body.userId
            }).then((reservationUser) => {
                return success(res, "Utilisateur ajouté à la réservation avec succès !", "RESERVATION/USER_ADDED", reservationUser);
            }).catch((e) => {
                console.log(e);
                return error(res, "Erreur lors de l'ajout de l'utilisateur à la réservation!", "RESERVATION/USER_ADD_FAILED");
            });
        } else {
            return error(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la récupération de la réservation", "RESERVATION/GET_FAILED");
    });
}

function removeUserFromReservation(req: Request, res: Response) {
    return Reservation.findByPk(req.body.resId).then((reservation) => {
        if (reservation) {
            return ReservationUser.destroy({
                where: {
                    reservationId: reservation.id,
                    userId: req.body.userId
                }
            }).then((reservationUser) => {
                return success(res, "Utilisateur retiré de la réservation avec succès !", "RESERVATION/USER_REMOVED", reservationUser);
            }).catch((e) => {
                console.log(e);
                return error(res, "Erreur lors du retrait de l'utilisateur de la réservation!", "RESERVATION/USER_REMOVE_FAILED");
            });
        } else {
            return error(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la récupération de la réservation", "RESERVATION/GET_FAILED");
    });
}

export default reservationUserController;