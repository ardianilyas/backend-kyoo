import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth.route";
import { requireAuth } from "./middlewares/auth";

dotenv.config();

const app: Application = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.json({ 
        message: "Welcome to kyoo event management and ticekting system"
    });
}); 

app.use("/api/auth", authRoute);

app.get("/api/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
})

export default app;