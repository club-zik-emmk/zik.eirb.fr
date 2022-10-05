import express from "express";

const router = express.Router();

import userRoutes from "./user.route";
import disponibilityRoutes from "./disponibility.route";
import reservationRoutes from "./reservation.route";

router.use("/users", userRoutes);
router.use("/disponibilities", disponibilityRoutes);
router.use("/reservations", reservationRoutes);

export default router;