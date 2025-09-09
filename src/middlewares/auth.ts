import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.accessToken;
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const payload = verifyAccessToken(token);
        req.user = { id: payload.userId, role: payload.role };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}