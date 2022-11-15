import express from "express";

import userController from "../controller/user.controller";
import { isConnected, isMember, isAdmin} from "../middlewares/permission.middleware";

const router = express.Router();

router.get("/", userController.listAllUsers);
router.get("/:id", userController.getUserById);

router.post("/", userController.createOrUpdateUser);
router.put("/:id", isConnected(), isAdmin(), userController.createOrUpdateUser);
router.delete("/:id", isConnected(), isAdmin(), userController.deleteUserById);

export default router;