import express from "express";

import disponibilityController from "../controller/disponibility.controller";
import { isConnected, isMember, isAdmin} from "../middlewares/permission.middleware";


const router = express.Router();

router.get("/", disponibilityController.listAllDisponibilities);
router.get("/:id", disponibilityController.getDisponibilityById);

router.post("/", isConnected(), isAdmin(), disponibilityController.createOrUpdateDisponibility);
router.put("/:id", isConnected(), isAdmin(), disponibilityController.createOrUpdateDisponibility);
router.delete("/:id", isConnected(), isAdmin(), disponibilityController.deleteDisponibilityById);

export default router;