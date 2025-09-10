import { NextFunction, Request, Response } from "express";
import { signAccessToken } from "../../utils/jwt";
import prisma from "../../config/prisma";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { validate } from "../../utils/validator";

const isProd = process.env.NODE_ENV === "production";

const repo = new AuthRepository();
const service = new AuthService(repo);

function setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}

function clearCookies(res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
}

export class AuthController {
    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(registerSchema, req.body);
            const user = await service.registerUser(data);
    
            const { accessToken, refreshToken } = await service.createTokens(user);
    
            setCookies(res, accessToken, refreshToken);
    
            return res.status(201).json({ 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
        } catch (err: any) {
            next(err)
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = loginSchema.parse(req.body)
            const user = await service.validateUser(data);
            if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
            const { accessToken, refreshToken } = await service.createTokens(user);
    
            setCookies(res, accessToken, refreshToken);
    
            return res.json({ 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                } 
            });
        } catch (err: any) {
            return res.status(500).json({ error: err.message || "Internal server error" });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const raw = req.cookies?.refreshToken;
            if (!raw) return res.status(401).json({ error: "Unauthorized" });
    
            const { refreshToken, userId } = await service.rotateRefreshToken(raw);
    
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error("User not found");
    
            const accessToken = signAccessToken({ userId: user.id, role: user.role });
            setCookies(res, accessToken, refreshToken);
    
            return res.json({ message: "Token refreshed" });
        } catch (err: any) {
            clearCookies(res);
            return res.status(401).json({ error: err.message || "Couldnot refresh token" });
        }
    }
    async logout(req: Request, res: Response) {
        try {
            const raw = req.cookies?.refreshToken;
            if (raw) {
                await service.revokedRefreshToken(raw);
            }
    
            clearCookies(res);
            return res.json({ message: "Logout successful" });
        } catch (err: any) {
            return res.status(500).json({ error: err.message || "Internal server error" });
        }
    }
}



