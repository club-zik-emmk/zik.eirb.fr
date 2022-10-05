import express from "express";

import disponibilityController from "../controller/disponibility.controller";
import { can, PERMISSIONS } from "../middlewares/permission.middleware";

const router = express.Router();

router.get("/", disponibilityController.listAllDisponibilities);
router.get("/:id", disponibilityController.getDisponibilityById);

router.post("/", can(PERMISSIONS.MANAGE_USERS), disponibilityController.createOrUpdateDisponibility);
router.put("/:id", can(PERMISSIONS.MANAGE_USERS), disponibilityController.createOrUpdateDisponibility);
router.delete("/:id", can(PERMISSIONS.MANAGE_USERS), disponibilityController.deleteDisponibilityById);

export default router;