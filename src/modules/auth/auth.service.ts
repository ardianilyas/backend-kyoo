import prisma from "../../config/prisma"
import bcrypt from "bcryptjs";
import { generateRefershToken, hashToken } from "../../utils/token";
import { addDays } from "date-fns";

const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30)

export async function registerUser(data: { name: string, email: string, password: string }) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashed
        }
    })
}

export async function validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    return user;
}

export async function createRefreshTokenForUser(userId: string) {
    const raw = generateRefershToken();
    const hashed = hashToken(raw);
    const expiresAt = addDays(new Date(), REFRESH_DAYS);

    await prisma.refreshToken.create({
        data: {
            tokenHash: hashed,
            userId,
            expiresAt
        }
    });

    return { raw, hashed, expiresAt }
}

export async function rotateRefreshToken(rawToken: string) {
    const hashed = hashToken(rawToken);
    const rt = await prisma.refreshToken.findUnique({ where: { tokenHash: hashed } });
    if (!rt) throw new Error("Invalid refresh token");

    if (rt.revoked) {
        await prisma.refreshToken.updateMany({
            where: { userId: rt.userId, revoked: false },
            data: { revoked: true, revokedAt: new Date() },
        });
        throw new Error("Refresh token reuse detected. All sessions revoked");
    }

    if (rt.expiresAt < new Date()) {
        await prisma.refreshToken.update({
            where: { id: rt.id },
            data: { revoked: true, revokedAt: new Date() },
        });
        throw new Error("Refresh token expired");
    }

    const { raw: newRaw, hashed: newHash, expiresAt } = await createRefreshTokenForUser(rt.userId);

    await prisma.refreshToken.update({
        where: { id: rt.id },
        data: { revoked: true, revokedAt: new Date(), replacedBy: newHash },
    });

    return { newRaw, expiresAt, userId: rt.userId };
}

export async function revokedRefreshToken(rawToken: string) {
    const hashed = hashToken(rawToken);
    await prisma.refreshToken.updateMany({
        where: { tokenHash: hashed },
        data: { revoked: true, revokedAt: new Date() },
    });
}