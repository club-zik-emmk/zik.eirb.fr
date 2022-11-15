import express from "express";

import reservationController from "../controller/reservation.controller";
import { isConnected, isMember, isAdmin} from "../middlewares/permission.middleware";


const router = express.Router();

router.get("/", reservationController.listAllReservations);
router.get("/:id", reservationController.getReservationById);

router.post("/", isConnected(), isMember(), reservationController.createOrUpdateReservation);
router.delete("/:id", isConnected(), isMember(), reservationController.deleteReservationById);

export default router;