import { Request, Response } from "express";
import { User } from "../models";

export const PERMISSIONS = {
    MANAGE_USERS: "manageUsers",
};

export const can = (permission: string) => async (req: Request, res: Response, next: () => void) => {
    const userId = "jchabrier";
    const user = await User.findByPk(userId);

    if (user) {
        if (permission === PERMISSIONS.MANAGE_USERS && !user.admin) {
            return res.status(403).send("You are not allowed to manage users");
        } else {
            next();
        }
    } else {
        return res.status(404).send("User not found");
    }
};