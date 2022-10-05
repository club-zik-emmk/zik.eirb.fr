import express from "express";

import reservationController from "../controller/reservation.controller";
import { can, PERMISSIONS } from "../middlewares/permission.middleware";

const router = express.Router();

router.get("/", reservationController.listAllReservations);
router.get("/:id", reservationController.getReservationById);

router.post("/", can(PERMISSIONS.MANAGE_USERS), reservationController.createOrUpdateReservation);
router.put("/:id", can(PERMISSIONS.MANAGE_USERS), reservationController.createOrUpdateReservation);
router.delete("/:id", can(PERMISSIONS.MANAGE_USERS), reservationController.deleteReservationById);

export default router;