import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

import routes from "./routes/routes";

import db from "./db";
import { initModels } from "./models";

async function run() {
    initModels(db);
    const app = express();

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