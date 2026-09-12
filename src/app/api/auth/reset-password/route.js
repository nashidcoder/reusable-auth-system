import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import { hashPassword } from "@/app/lib/auth";
import { validateResetPassword } from "@/app/lib/validation";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    const validationError = validateResetPassword({ password });

    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Reset token is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.sessionVersion += 1;

    await user.save();

    // Password reset ke baad purani sessions revoke.
    await Session.updateMany(
      { userId: user._id },
      { $set: { revoked: true } }
    );

    const response = NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );

    // Purani access token bhi remove.
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}