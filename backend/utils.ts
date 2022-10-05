import axios from "axios";
import { Response } from "express";

export function error(res: Response, message: string, code: string, status = 400) {
    return res.status(status).json({
        status: "error",
        message: message,
        code: code
    });
}

export function internalError(res: Response, error: Error) {
    return res.status(500).json({
        status: "error",
        message: error.message,
        code: "INTERNAL_ERROR"
    });
}

export function success<T>(res: Response, message: string, code: string, data: T) {
    return res.status(200).json({
        status: "success",
        message: message,
        code: code,
        data: data
    });
}

export async function validateCasTicket(
    casServerUrl: string,
    serviceUrl: string,
    ticket: string
): Promise<string | null> {
    const response = await axios.get<string>(
        `${casServerUrl}/serviceValidate?service=${encodeURIComponent(
            serviceUrl
        )}&ticket=${ticket}`
    );
    const body = await response.data;
    const username = body.split("<cas:user>")[1]?.split("</cas:user>")[0] || null;

    return username;
}