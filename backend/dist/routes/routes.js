"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_route_1 = __importDefault(require("./user.route"));
const disponibility_route_1 = __importDefault(require("./disponibility.route"));
const reservation_route_1 = __importDefault(require("./reservation.route"));
const authentication_route_1 = __importDefault(require("./authentication.route"));
const reservationUser_route_1 = __importDefault(require("./reservationUser.route"));
router.use("/users", user_route_1.default);
router.use("/disponibilities", disponibility_route_1.default);
router.use("/reservations", reservation_route_1.default);
router.use("/reservationsUsers", reservationUser_route_1.default);
router.use("/", authentication_route_1.default);
exports.default = router;
