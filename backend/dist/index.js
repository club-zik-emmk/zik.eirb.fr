"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const db_1 = __importDefault(require("./db"));
const models_1 = require("./models");
async function run() {
    (0, models_1.initModels)(db_1.default);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }));
    app.set("json spaces", 2);
    app.use(body_parser_1.default.json({ limit: "50mb" }));
    //app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    app.use(function (error, req, res, next) {
        res.status(500).send({
            status: "error",
            message: error.message
        });
    });
    //app.use(cors());
    app.use("/api/v1", routes_1.default);
    const PORT = process.env.PORT || 5000;
    db_1.default.sync().then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }).catch(err => console.log("Error: " + err));
}
run();
