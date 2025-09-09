import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors"; // This line is causing the error
import prisma from "./config/prisma";

dotenv.config();

const app: Application = express();

app.use(cors())
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ 
        message: "Welcome to kyoo event management and ticekting system"
    });
}); 

export default app;