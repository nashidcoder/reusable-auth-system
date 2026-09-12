import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/models/User";
import {
  generateToken,
  hashToken,
  getTokenExpiry,
} from "@/app/lib/auth";
import { validateResendVerification } from "@/app/lib/validation";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const validationError = validateResendVerification({ email });

    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If your account exists, a verification email has been sent.",
        },
        { status: 200 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Your email is already verified." },
        { status: 200 }
      );
    }

    const verificationToken = generateToken();

    user.verificationToken = hashToken(verificationToken);
    user.verificationTokenExpires = getTokenExpiry(15);

    await user.save();

    // New verification email send kar rahe hain.
    await sendVerificationEmail(
      user.email,
      verificationToken
    );

    return NextResponse.json(
      { message: "A new verification email has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}