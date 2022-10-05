import express from "express";

import userController from "../controller/user.controller";
import { can, PERMISSIONS } from "../middlewares/permission.middleware";

const router = express.Router();

router.get("/", userController.listAllUsers);
router.get("/:id", userController.getUserById);

router.post("/", can(PERMISSIONS.MANAGE_USERS), userController.createOrUpdateUser);
router.put("/:id", can(PERMISSIONS.MANAGE_USERS), userController.createOrUpdateUser);
router.delete("/:id", can(PERMISSIONS.MANAGE_USERS), userController.deleteUserById);

export default router;