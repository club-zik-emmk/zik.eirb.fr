import express from "express";

import reservationController from "../controller/reservation.controller";
import { isConnected, isAdmin } from "../middlewares/permission.middleware";

const router = express.Router();

router.get("/", reservationController.listAllReservations);
router.get("/:id", reservationController.getReservationById);

// Pour le développement local, commentez isConnected()
// router.post("/", isConnected(), reservationController.createOrUpdateReservation);
// router.post("/admin", isConnected(), isAdmin(), reservationController.createAdminReservation);
router.post("/", isConnected(), reservationController.createOrUpdateReservation);
router.post("/admin", isConnected(), isAdmin(), reservationController.createAdminReservation);

router.put("/:id", isConnected(), reservationController.createOrUpdateReservation);
router.delete("/:id", isConnected(), reservationController.deleteReservationById);

export default router;