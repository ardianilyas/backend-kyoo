import { NextFunction, Request, Response } from "express";

export function erroHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err.errors) {
        return res.status(err.status || 400).json({ errors: err.errors });
    }

    return res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}