"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const permission_middleware_1 = require("../middlewares/permission.middleware");
const router = express_1.default.Router();
router.get("/", user_controller_1.default.listAllUsers);
router.get("/:id", user_controller_1.default.getUserById);
router.post("/", (0, permission_middleware_1.can)(permission_middleware_1.PERMISSIONS.MANAGE_USERS), user_controller_1.default.createOrUpdateUser);
router.put("/:id", (0, permission_middleware_1.can)(permission_middleware_1.PERMISSIONS.MANAGE_USERS), user_controller_1.default.createOrUpdateUser);
router.delete("/:id", (0, permission_middleware_1.can)(permission_middleware_1.PERMISSIONS.MANAGE_USERS), user_controller_1.default.deleteUserById);
exports.default = router;
