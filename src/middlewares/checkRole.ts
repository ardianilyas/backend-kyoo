import { NextFunction, Request, Response } from "express";

export function checkRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });

        if(!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden: insufficient role" });

        next();
    }
}