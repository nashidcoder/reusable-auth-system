import crypto from "crypto";
import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

import { connectDB } from "@/app/lib/db";
import {
  createAccessToken,
  createRefreshToken,
  generateToken,
  hashToken,
} from "@/app/lib/auth";
import User from "@/models/User";
import Session from "@/models/Session";

// Google ke public keys.
const googleKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Google ne error bheja ho.
    if (searchParams.get("error")) {
      return NextResponse.redirect(
        new URL("/login?error=google", request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/login?error=google", request.url)
      );
    }

    // Saved state cookie.
    const cookieState = request.cookies.get(
      "google_oauth_state"
    )?.value;

    // OAuth request ko verify kar rahe hain.
    if (!cookieState || cookieState !== state) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_state", request.url)
      );
    }

    // Authorization code ko Google tokens mein exchange kar rahe hain.
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Google token exchange failed.");
    }

    const tokens = await tokenResponse.json();

    if (!tokens.id_token) {
      throw new Error("Google ID token missing.");
    }

    // Google ID token verify kar rahe hain.
    const { payload } = await jwtVerify(
      tokens.id_token,
      googleKeys,
      {
        issuer: [
          "https://accounts.google.com",
          "accounts.google.com",
        ],
        audience: process.env.GOOGLE_CLIENT_ID,
      }
    );

    // Google account ki basic information.
    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name || "Google User";

    if (!googleId || !email || payload.email_verified !== true) {
      throw new Error("Google account information is invalid.");
    }

    await connectDB();

    // Pehle Google ID se user find karenge.
    let user = await User.findOne({ googleId });

    // Agar Google ID nahi mili to email check karenge.
    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        // Existing account ke saath Google account link.
        user.googleId = googleId;
        user.isVerified = true;

        await user.save();
      } else {
        // New Google user.
        user = await User.create({
          name,
          email,
          googleId,
          isVerified: true,
          role: "customer",
        });
      }
    }

    // Naya refresh-session family.
    const familyId = crypto.randomUUID();

    // Temporary session ID pehle generate kar rahe hain.
    const session = await Session.create({
      userId: user._id,
      refreshTokenHash: "temporary",
      familyId,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    // Access token.
    const accessToken = await createAccessToken(user);

    // Refresh token.
    const refreshToken = await createRefreshToken(
      user,
      session._id.toString()
    );

    // Actual refresh token hash database mein save.
    session.refreshTokenHash = hashToken(refreshToken);

    await session.save();

    // Login response.
    const response = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );

    // Access cookie.
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    // Refresh cookie.
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // OAuth state cookie remove.
    response.cookies.set("google_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);

    return NextResponse.redirect(
      new URL("/login?error=google", request.url)
    );
  }
}