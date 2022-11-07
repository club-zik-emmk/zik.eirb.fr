"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ioredis_1 = __importDefault(require("ioredis"));
const routes_1 = __importDefault(require("./routes/routes"));
const db_1 = __importDefault(require("./db"));
const models_1 = require("./models");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function run() {
    const redisClient = new ioredis_1.default(parseInt(process.env.REDIS_PORT || "6379"), process.env.REDIS_HOST || "localhost", {
        password: process.env.REDIS_PASSWORD,
    });
    redisClient.on("error", console.error);
    redisClient.on("connect", () => console.log("Redis connected"));
    const redisStore = (0, connect_redis_1.default)(express_session_1.default);
    (0, models_1.initModels)(db_1.default);
    const app = (0, express_1.default)();
    app.use((0, cookie_parser_1.default)(process.env.SESSION_SECRET || "secret"));
    app.use((0, express_session_1.default)({
        store: new redisStore({ client: redisClient }),
        name: "session",
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: false,
        }
    }));
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
