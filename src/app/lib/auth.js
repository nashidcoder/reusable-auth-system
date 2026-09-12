import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is missing in .env.local");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is missing in .env.local");
}

const accessSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(REFRESH_TOKEN_SECRET);

// Password hash karne ka function.
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// Password verify karne ka function.
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Secure random token banane ka function.
export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Token ko hash karne ka function.
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Token expiry date banane ka function.
export function getTokenExpiry(minutes = 15) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Access JWT create karne ka function.
export async function createAccessToken(user) {
  return new SignJWT({
    sub: user._id.toString(),
    role: user.role,
    sessionVersion: user.sessionVersion,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer("reusable-auth-system")
    .setAudience("reusable-auth-client")
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);
}

// Refresh JWT create karne ka function.
export async function createRefreshToken(user, sessionId) {
  return new SignJWT({
    sub: user._id.toString(),
    sid: sessionId,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer("reusable-auth-system")
    .setAudience("reusable-auth-client")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);
}

// Access token verify karne ka function.
export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, accessSecret, {
    issuer: "reusable-auth-system",
    audience: "reusable-auth-client",
  });

  return payload;
}

// Refresh token verify karne ka function.
export async function verifyRefreshToken(token) {
  const { payload } = await jwtVerify(token, refreshSecret, {
    issuer: "reusable-auth-system",
    audience: "reusable-auth-client",
  });

  return payload;
}

// Check karta hai ke user allowed role mein hai ya nahi.
export function hasRole(user, allowedRoles) {
  if (!user || !user.role) {
    return false;
  }

  return allowedRoles.includes(user.role);
}