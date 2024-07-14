import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors"
config({ path: "./config/config.env" });

export const app = express();

// Using middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Importing & Using Router
import users from "./routes/usersRoutes.js";
import books from "./routes/booksRoutes.js";

app.use("/api/v1", users);
app.use("/api/v1", books);


app.get("/", (req, res) =>
    res.send(
        `<h1>Site is Working. click <a href='${process.env.FRONTEND_URL}' here </a> to visit frontend.</h1>`
    )
);

export default app;

app.use(ErrorMiddleware)