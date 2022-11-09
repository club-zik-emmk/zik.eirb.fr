import { Request, Response } from "express";
import { User } from "../models";

export const PERMISSIONS = {
    MANAGE_USERS: "manageUsers",
};

export const can = (permission: string) => async (req: Request, res: Response, next: () => void) => {
    // @ts-ignore
    if (req.session.user){
        // @ts-ignore
        const userId = req.session.user.id;
        // get user from database
        const user = await User.findByPk(userId);
        // if user exists, check if it has the permission
        if (user) {
            if (permission === PERMISSIONS.MANAGE_USERS && !user.admin) {
                return res.status(403).send("You are not allowed to manage users");
            } else {
                next();
            }
        } else {
            return res.status(404).send("User not found");
        }
    } else {
        return res.status(401).send("You are not authenticated");
    }

    
};