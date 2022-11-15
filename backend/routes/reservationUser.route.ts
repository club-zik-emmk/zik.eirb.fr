import express from "express";

import reservationUserController from "../controller/reservationUser.controller";
import { isConnected, isMember, isAdmin} from "../middlewares/permission.middleware";

//isConnected(), isMember(),
const router = express.Router();

router.get("/:id", isConnected(), isMember(), reservationUserController.getUserByReservation);

router.post("/", isConnected(), isMember(), reservationUserController.addUserToReservation);
router.delete("/", isConnected(), isMember(), reservationUserController.removeUserFromReservation);

export default router;