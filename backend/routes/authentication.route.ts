import express from "express";

import {me, authenticate, logout} from "../controller/authentication.controller";

const router = express.Router();

router.get("/auth", authenticate);
router.get("/me", me);
router.get("/logout", logout);

export default router;