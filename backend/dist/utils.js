"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCasTicket = exports.success = exports.internalError = exports.error = void 0;
const axios_1 = __importDefault(require("axios"));
function error(res, message, code, status = 400) {
    return res.status(status).json({
        status: "error",
        message: message,
        code: code
    });
}
exports.error = error;
function internalError(res, error) {
    return res.status(500).json({
        status: "error",
        message: error.message,
        code: "INTERNAL_ERROR"
    });
}
exports.internalError = internalError;
function success(res, message, code, data) {
    return res.status(200).json({
        status: "success",
        message: message,
        code: code,
        data: data
    });
}
exports.success = success;
async function validateCasTicket(casServerUrl, serviceUrl, ticket) {
    const response = await axios_1.default.get(`${casServerUrl}/serviceValidate?service=${encodeURIComponent(serviceUrl)}&ticket=${ticket}`);
    const body = await response.data;
    const username = body.split("<cas:user>")[1]?.split("</cas:user>")[0] || null;
    return username;
}
exports.validateCasTicket = validateCasTicket;
