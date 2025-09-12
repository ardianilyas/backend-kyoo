import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export function erroHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err.name === "ZodError") {
        return res.status(err.status || 400).json({ errors: err.errors });
    }

    if (err instanceof AppError) {
        return res.status(err.status).json({
          error: err.message,
          details: err.details ?? null,
        });
    }

    // if (err.status) {
    //     return res.status(err.status).json({
    //         error: err.message,
    //         details: err.details || null,
    //     });
    // }

    return res.status(500).json({ error: err.message || "Internal server error" });
}