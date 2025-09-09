import { Request, Response } from "express";
import { createRefreshTokenForUser, registerUser, revokedRefreshToken, rotateRefreshToken, validateUser } from "./auth.service";
import { signAccessToken } from "../../utils/jwt";
import prisma from "../../config/prisma";

const isProd = process.env.NODE_ENV === "production";

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
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

function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
}

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser({ name, email, password });

        const accessToken = signAccessToken({ userId: user.id, role: user.role });

        const { raw: refreshToken } = await createRefreshTokenForUser(user.id);

        setAuthCookies(res, accessToken, refreshToken);

        return res.status(201).json({ 
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err: any) {
        return res.status(400).json({ error: err.message || "Bad request" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user = await validateUser(email, password);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const accessToken = signAccessToken({ userId: user.id, role: user.role });
        const { raw: refreshToken } = await createRefreshTokenForUser(user.id);

        setAuthCookies(res, accessToken, refreshToken);

        return res.json({ user: {
                id: user.id,
                name: user.name,
                email: user.email
            } 
        });
    } catch (err: any) {
        return res.status(500).json({ error: err.message || "Internal server error" });
    }
}

export async function refresh(req: Request, res: Response) {
    try {
        const raw = req.cookies?.refreshToken;
        if (!raw) return res.status(401).json({ error: "Unauthorized" });

        const { newRaw, userId } = await rotateRefreshToken(raw);

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const accessToken = signAccessToken({ userId: user.id, role: user.role });
        setAuthCookies(res, accessToken, newRaw);

        return res.json({ message: "Token refreshed" });
    } catch (err: any) {
        clearAuthCookies(res);
        return res.status(401).json({ error: err.message || "Couldnot refresh token" });
    }
}

export async function logout(req: Request, res: Response) {
    try {
        const raw = req.cookies?.refreshToken;
        if (raw) {
            await revokedRefreshToken(raw);
        }

        clearAuthCookies(res);
        return res.json({ message: "Logout successful" });
    } catch (err: any) {
        return res.status(500).json({ error: err.message || "Internal server error" });
    }
}