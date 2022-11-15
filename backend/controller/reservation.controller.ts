import {Request, Response} from "express";
import {Reservation} from "../models";
import {User} from "../models";
import {error, success} from "../utils";

const reservationController = {
    listAllReservations,
    getReservationById,
    createOrUpdateReservation,
    deleteReservationById
};


function listAllReservations(req: Request, res: Response) {
    return Reservation.findAll().then((reservations) => {
        return success(res, "Liste des réservations", "RESERVATION/LIST", reservations);
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la récupération de la liste des réservations", "RESERVATION/LIST_FAILED");
    });
}


function getReservationById(req: Request, res: Response) {
    return Reservation.findByPk(req.params.id).then((reservation) => {
        if (reservation) {
            return success(res, "Détails de la réservation", "RESERVATION/DETAILS", reservation);
        } else {
            return error(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la récupération de la réservation", "RESERVATION/GET_FAILED");
    });
}


async function createOrUpdateReservation(req: Request, res: Response) {

    // check that title is a string and not too long
    if (typeof req.body.title !== "string" || req.body.title.length > 100) {
        return error(res, "Le titre doit être une chaîne de caractères de maximum 100 caractères", "VALIDATION/TITLE_INVALID");
    }

    // check that startDate is a date in format "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(req.body.startDate)) {
        return error(res, "La date de début doit être au format YYYY-MM-DD HH:mm:ss", "VALIDATION/START_DATE_INVALID");
    }

    // check that endDate is a date in format "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(req.body.endDate)) {
        return error(res, "La date de fin doit être au format YYYY-MM-DD HH:mm:ss", "VALIDATION/END_DATE_INVALID");
    }

    // check that startDate is before endDate
    if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
        return error(res, "La date de début doit être avant la date de fin", "VALIDATION/START_DATE_BEFORE_END_DATE");
    }

    // Create local user object from request body

    const reservation = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        // @ts-ignore
        ownerId: req.session.user.id,
    };

    return Reservation.create(reservation)
        .then((user) => {
            return success(res, "Réservation créée avec succès !", "RESERVATION/CREATED", reservation);
        }).catch((e) => {
            console.log(e);
            return error(res, "Erreur lors de la création de la réservation!", "RESERVATION/CREATE_FAILED");
        });
}


function deleteReservationById(req: Request, res: Response) {
    // @ts-ignore
    // check that the user is connected
    if (!req.session.user) {
        return error(res, "Vous devez être connecté pour supprimer une réservation", "AUTH/NOT_AUTHENTICATED", 401);
    }
    // Check that the user is the owner of the reservation or an admin
    return Reservation.findByPk(req.params.id).then((reservation) => {
        if (reservation) {
            // @ts-ignore
            if (reservation.ownerId === req.session.user.id || req.session.user.isAdmin) {
                return reservation.destroy().then(() => {
                    return success(res, "Réservation supprimée avec succès !", "RESERVATION/DELETED", reservation.id);
                }).catch((e) => {
                    console.log(e);
                    return error(res, "Erreur lors de la suppression de la réservation", "RESERVATION/DELETE_FAILED");
                });
            } else {
                return error(res, "Vous n'êtes pas autorisé à supprimer cette réservation", "RESERVATION/DELETE_NOT_ALLOWED", 403);
            }
        } else {
            return error(res, "Réservation introuvable !", "RESERVATION/NOT_FOUND", 404);
        }
    }).catch((e) => {
        console.log(e);
        return error(res, "Erreur lors de la suppression de la réservation", "RESERVATION/DELETE_FAILED");
    });
}


export default reservationController;