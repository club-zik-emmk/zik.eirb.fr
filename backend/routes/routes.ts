import express from "express";

const router = express.Router();

import userRoutes from "./user.route";
import disponibilityRoutes from "./disponibility.route";
import reservationRoutes from "./reservation.route";
import authenticationRoutes from "./authentication.route";
import reservationUserRoutes from "./reservationUser.route";

router.use("/users", userRoutes);
router.use("/disponibilities", disponibilityRoutes);
router.use("/reservations", reservationRoutes);
router.use("/reservationsUsers", reservationUserRoutes);
router.use("/", authenticationRoutes);

export default router;