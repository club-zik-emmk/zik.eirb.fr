import { Request, Response } from "express";
import { Reservation } from "../models";
import { ReservationUser } from "../models";
import { error, success } from "../utils";

const reservationController = {
    listAllReservations,
    getReservationById,
    createOrUpdateReservation,
    deleteReservationById
};


async function listAllReservations(req: Request, res: Response) {
    let reservationsWithUsers: any[] = [];
    const reservations = await Reservation.findAll();
    // for each reservation, get the users associated and add them to the reservation object
    for (let reservation of reservations) {
        const reservationsUsers = await ReservationUser.findAll({
            where: {
                reservationId: reservation.id
            }
        });

        let users: any[] = [];

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

    success(res, "Réservations récupérées avec succès !", "RESERVATION/RETRIEVED", reservationsWithUsers);
}


function getReservationById(req: Request, res: Response) {
    return Reservation.findByPk(req.params.id).then((reservation) => {
        //get array of users in reservation and add it to reservation object
        if (reservation) {
            ReservationUser.findAll({
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
                return success(res, "Réservation", "RESERVATION/GET", resWithUsers);
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

    try {
        const insertedReservation = await Reservation.create({
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            ownerId: req.session.user.id,
        });

        if (req.body.users) {
            for (let userId of req.body.users) {
                await ReservationUser.create({
                    reservationId: insertedReservation.id,
                    userId: userId
                });
            }
        }

        return success(res, "Réservation créée avec succès !", "RESERVATION/CREATED", insertedReservation.id);
    } catch (e) {
        console.error(e);
        return error(res, "Erreur lors de la création de la réservation!", "RESERVATION/CREATE_FAILED");
    }
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