import prisma from "../../config/prisma"
import bcrypt from "bcryptjs";
import { generateRefershToken, hashToken } from "../../utils/token";
import { addDays } from "date-fns";
import { AuthRepository } from "./auth.repository";
import { signAccessToken } from "../../utils/jwt";
import { LoginSchema, RegisterSchema } from "./auth.schema";

export class AuthService {
    private repo: AuthRepository;
    private refreshDays: number;

    constructor(repo: AuthRepository) {
        this.repo = repo;
        this.refreshDays = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30)
    }

    async registerUser(data: RegisterSchema) {
        const exists = await this.repo.findUserByEmail(data.email);
        if (exists) throw new Error("Email already exists");
    
        const hashed = await bcrypt.hash(data.password, 10);
    
        const user = await this.repo.createUser({ ...data, password: hashed });

        return user;
    }

    async validateUser(data: LoginSchema) {
        const user = await this.repo.findUserByEmail(data.email);
        if (!user) return null;
    
        const ok = await bcrypt.compare(data.password, user.password);

        return ok ? user : null;
    }

    async createTokens(user: { id: string, role: string }) {
        const accessToken = signAccessToken({ userId: user.id, role: user.role });

        const raw = generateRefershToken();
        const hashed = hashToken(raw);

        const expiresAt = addDays(new Date(), this.refreshDays);
    
        await this.repo.createRefreshToken({ tokenHash: hashed, userId: user.id, expiresAt })
    
        return { accessToken, refreshToken: raw }
    }

    async rotateRefreshToken(rawToken: string) {
        const hashed = hashToken(rawToken);
        const token = await this.repo.findRefreshTokenByHash(hashed)
        if (!token) throw new Error("Invalid refresh token");
    
        if (token.revoked) {
            await this.repo.revokeAllUserTokens(token.userId);
            throw new Error("Refresh token reuse detected. All sessions revoked");
        }
    
        if (token.expiresAt < new Date()) {
            await this.repo.revokeToken(token.id);
            throw new Error("Refresh token expired");
        }
    
        const rawNew = generateRefershToken();
        const hashedNew = hashToken(rawNew);
        const expiresAt = addDays(new Date(), this.refreshDays);
    
        await this.repo.createRefreshToken({ tokenHash: hashedNew, userId: token.userId, expiresAt });
        await this.repo.revokeToken(token.id, hashedNew);
    
        return { refreshToken: rawNew, userId: token.userId };
    }

    async revokedRefreshToken(rawToken: string) {
        const hashed = hashToken(rawToken);
        const token = await this.repo.findRefreshTokenByHash(hashed);
        if (token) {
            await this.repo.revokeToken(token.id);
        }
    }
}
