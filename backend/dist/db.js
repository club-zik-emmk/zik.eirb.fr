"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_js_1 = __importDefault(require("./config/config.js"));
const env = process.env.NODE_ENV || "development";
const config = config_js_1.default[env];
const db = new sequelize_1.Sequelize({
    ...config,
});
exports.default = db;
