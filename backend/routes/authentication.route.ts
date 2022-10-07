import express from "express";

import {me, authenticate, logout} from "../controller/authentication.controller";
import { can, PERMISSIONS } from "../middlewares/permission.middleware";

const router = express.Router();

router.get("/auth", authenticate);
router.get("/me", me);
router.get("/logout", logout);

export default router;