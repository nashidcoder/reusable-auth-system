import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
  hashToken,
} from "@/app/lib/auth";

export async function POST(request) {
  try {
    const refreshToken =
      request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is missing." },
        { status: 401 }
      );
    }

    await connectDB();

    const payload = await verifyRefreshToken(refreshToken);

    const userId = payload.sub;
    const sessionId = payload.sid;

    if (!userId || !sessionId) {
      return NextResponse.json(
        { message: "Invalid refresh token." },
        { status: 401 }
      );
    }

    const refreshTokenHash = hashToken(refreshToken);

    const session = await Session.findOne({
      _id: sessionId,
      userId,
      refreshTokenHash,
    });

    if (!session || session.revoked) {
      return NextResponse.json(
        { message: "Invalid or already used refresh token." },
        { status: 401 }
      );
    }

    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Refresh session has expired." },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 401 }
      );
    }

    // Purana refresh token revoke kar rahe hain.
    session.revoked = true;
    await session.save();

    const newSession = await Session.create({
      userId: user._id,
      refreshTokenHash: "temporary",
      familyId: session.familyId,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    const newSessionId = newSession._id.toString();

    const newAccessToken = await createAccessToken(user);

    const newRefreshToken = await createRefreshToken(
      user,
      newSessionId
    );

    newSession.refreshTokenHash = hashToken(newRefreshToken);
    session.replacedBy = newSession._id;

    await newSession.save();
    await session.save();

    const response = NextResponse.json(
      { message: "Token refreshed successfully." },
      { status: 200 }
    );

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);

    return NextResponse.json(
      { message: "Invalid or expired refresh token." },
      { status: 401 }
    );
  }
}