"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMember = exports.isAdmin = exports.isConnected = void 0;
const models_1 = require("../models");
const isConnected = () => async (req, res, next) => {
    // @ts-ignore
    if (!req.session.user) {
        res.status(401).json({
            success: false,
            error: {
                message: "User not authenticated",
            },
        });
        return;
    }
    next();
};
exports.isConnected = isConnected;
const isAdmin = () => async (req, res, next) => {
    // @ts-ignore
    if (!req.session.user) {
        res.status(401).json({
            success: false,
            error: {
                message: "User not authenticated",
            },
        });
        return;
    }
    // @ts-ignore
    const user = await models_1.User.findById(req.session.user.id);
    if (!user || !user.admin) {
        res.status(403).json({
            success: false,
            error: {
                message: "User is not an admin",
            },
        });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
const isMember = () => async (req, res, next) => {
    // @ts-ignore
    if (!req.session.user) {
        res.status(401).json({
            success: false,
            error: {
                message: "User not authenticated",
            },
        });
        return;
    }
    // @ts-ignore
    const user = await models_1.User.findById(req.session.user.id);
    if (!user || !user.member) {
        res.status(403).json({
            success: false,
            error: {
                message: "User is not a member",
            },
        });
        return;
    }
    next();
};
exports.isMember = isMember;
