import { Request, Response } from "express";
import { User } from "../models";

export const isConnected = () => async (req: Request, res: Response, next: () => void) => {

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
    
export const isAdmin = () => async (req: Request, res: Response, next: () => void) => {
    if (!req.session.user) {
        res.status(401).json({
            success: false,
            error: {
                message: "User not authenticated",
            },
        });
        return;
    }

    const user = await User.findByPk(req.session.user.id);
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

export const isMember = () => async (req: Request, res: Response, next: () => void) => {
    // Session type redefines the session object to include the user property
    if (!req.session.user) {
        res.status(401).json({
            success: false,
            error: {
                message: "User not authenticated",
            },
        });
        return;
    }

    const user = await User.findByPk(req.session.user.id);
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
