import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import connectRedis from "connect-redis";
import session from "express-session";
import redis from "redis";
import cookieParser from "cookie-parser";
import Redis from 'ioredis';
import routes from "./routes/routes";

import db from "./db";
import { initModels } from "./models";
import dotenv from "dotenv";
dotenv.config();

async function run() {
    const redisClient = new Redis(
        parseInt(process.env.REDIS_PORT || "6379"),
        process.env.REDIS_HOST || "localhost",
        {
            password: process.env.REDIS_PASSWORD,
        }
    );

    redisClient.on("error", console.error);
    redisClient.on("connect", () => console.log("Redis connected"));

    const redisStore = connectRedis(session);

    initModels(db);
    const app = express();

    app.use(cookieParser(process.env.SESSION_SECRET || "secret"));
    app.use(session({
        store: new redisStore({ client: redisClient }),
        name: "session",
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            httpOnly: true,
            secure: false,
        }
    }));
    
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }));

    app.set("json spaces", 2);
    app.use(bodyParser.json({ limit: "50mb" }));
    //app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    app.use(function (error: Error, req: Request, res: Response, next: () => void) {
        res.status(500).send({
            status: "error",
            message: error.message
        });
    });
    //app.use(cors());

    app.use("/api/v1", routes);

    const PORT = process.env.PORT || 5000;
    db.sync().then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }).catch(err => console.log("Error: " + err));
}

run();