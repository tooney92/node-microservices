"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: (0, path_1.dirname)(module.paths[1]) + "/.env" });
}
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to the microservices API');
});
app.use((req, res, next) => {
    const error = new Error('page not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        },
        handled: false
    });
});
mongoose_1.default.connect(process.env.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose_1.default.connection;
db.on("open", () => {
    console.log("mongodb connectedd");
});
app.listen(3000, () => {
    console.log('we up and running port 3000');
});
//# sourceMappingURL=app.js.map