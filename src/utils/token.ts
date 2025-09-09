import crypto from 'crypto';

export function generateRefershToken() {
    return crypto.randomBytes(64).toString("hex");
}

export function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}