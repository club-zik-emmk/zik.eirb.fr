"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.can = exports.PERMISSIONS = void 0;
const models_1 = require("../models");
exports.PERMISSIONS = {
    MANAGE_USERS: "manageUsers",
};
const can = (permission) => async (req, res, next) => {
    const userId = "jchabrier";
    const user = await models_1.User.findByPk(userId);
    if (user) {
        if (permission === exports.PERMISSIONS.MANAGE_USERS && !user.admin) {
            return res.status(403).send("You are not allowed to manage users");
        }
        else {
            next();
        }
    }
    else {
        return res.status(404).send("User not found");
    }
};
exports.can = can;
