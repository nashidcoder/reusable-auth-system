import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { validateForgotPassword } from "@/app/lib/validation";
import { sendResetPasswordEmail } from "@/app/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const validationError = validateForgotPassword({ email });

    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    // Security ke liye same response denge,
    // chahe account exist karta ho ya nahi.
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;

    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // User ko actual reset email bhej rahe hain.
    await sendResetPasswordEmail(
      user.email,
      resetToken
    );

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}