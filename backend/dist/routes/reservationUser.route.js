"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationUser_controller_1 = __importDefault(require("../controller/reservationUser.controller"));
const permission_middleware_1 = require("../middlewares/permission.middleware");
//isConnected(), isMember(),
const router = express_1.default.Router();
router.get("/:id", (0, permission_middleware_1.isConnected)(), (0, permission_middleware_1.isMember)(), reservationUser_controller_1.default.getUserByReservation);
router.post("/", (0, permission_middleware_1.isConnected)(), (0, permission_middleware_1.isMember)(), reservationUser_controller_1.default.addUserToReservation);
router.delete("/", (0, permission_middleware_1.isConnected)(), (0, permission_middleware_1.isMember)(), reservationUser_controller_1.default.removeUserFromReservation);
exports.default = router;
