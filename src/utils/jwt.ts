import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export function signAccessToken(payload: JwtPayload) {
  const options: SignOptions = { expiresIn: 15 * 60 }; // 15 minutes
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}