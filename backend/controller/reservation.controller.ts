import { Request, Response } from "express";
import { Reservation } from "../models";
import { ReservationUser } from "../models";
import { error, success } from "../utils";

const reservationController = {
    listAllReservations,
    getReservationById,
    createOrUpdateReservation,
    deleteReservationById,
    createAdminReservation,
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

// create admin reservation
async function createAdminReservation(req: Request, res: Response) {

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

    // delete all previous reservation between startDate and endDate
    Reservation.destroy({
        where: {
            startDate: {
                $between: [req.body.startDate, req.body.endDate]
            },
            endDate: {
                $between: [req.body.startDate, req.body.endDate]
            }
        }
    });

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
    } else {
        // Create a reservation for each day between startDate and endDate
        // the first reservation starts at startDate and ends at 22h30
        // the last reservation starts at 8h00 and ends at endDate
        // the other reservations start at 8h00 and end at 22h30
        const firstReservation = {
            title: req.body.title,
            startDate: startDate,
            endDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 22, 30),
            ownerId: req.body.ownerId
        };
        reservations.push(firstReservation);

        const lastReservation = {
            title: req.body.title,
            startDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 8, 0),
            endDate: endDate,
            ownerId: req.body.ownerId
        };
        reservations.push(lastReservation);

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
        
    return Reservation.bulkCreate(reservations).then((reservations) => {
        return success(res, "Réservations créées avec succès !", "RESERVATION/CREATED", reservations);
        }).catch((e) => {
            console.log(e);
            return error(res, "Erreur lors de la création des réservations!", "RESERVATION/CREATE_FAILED");
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