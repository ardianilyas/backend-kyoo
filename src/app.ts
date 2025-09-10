import dotenv from "dotenv";
import "dotenv/config"
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { erroHandler } from "./middlewares/errorHandler";
import router from "./routes";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", router)

app.use(erroHandler);

export default app;