"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const disponibility_controller_1 = __importDefault(require("../controller/disponibility.controller"));
const permission_middleware_1 = require("../middlewares/permission.middleware");
const router = express_1.default.Router();
router.get("/", disponibility_controller_1.default.listAllDisponibilities);
router.get("/:id", disponibility_controller_1.default.getDisponibilityById);
router.post("/", (0, permission_middleware_1.isConnected)(), (0, permission_middleware_1.isAdmin)(), disponibility_controller_1.default.createOrUpdateDisponibility);
router.put("/:id", (0, permission_middleware_1.isConnected)(), (0, permission_middleware_1.isAdmin)(), disponibility_controller_1.default.createOrUpdateDisponibility);
router.delete("/:id", (0, permission_middleware_1.isConnected)(), (0, permission_middleware_1.isAdmin)(), disponibility_controller_1.default.deleteDisponibilityById);
exports.default = router;
