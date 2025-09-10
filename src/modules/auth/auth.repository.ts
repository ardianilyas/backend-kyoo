import { RefreshToken, User } from "../../../prisma/generated/prisma";
import prisma from "../../config/prisma";
import { RegisterSchema } from "./auth.schema";

export class AuthRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async createUser(data: RegisterSchema): Promise<User> {
        return prisma.user.create({ data });
    }

    async createRefreshToken(data: { tokenHash: string, userId: string, expiresAt: Date }): Promise<RefreshToken> {
        return prisma.refreshToken.create({ data });
    }

    async findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
        return prisma.refreshToken.findUnique({ where: { tokenHash } });
    }

    async revokeToken(id: string, replacedBy?: string) {
        return prisma.refreshToken.update({
            where: { id },
            data: { revoked: true, revokedAt: new Date(), replacedBy },
        });
    }

    async revokeAllUserTokens(userId: string) {
        return prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true, revokedAt: new Date() }
        });
    }
}