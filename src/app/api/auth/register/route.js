import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/models/User";
import {
  hashPassword,
  generateToken,
  hashToken,
  getTokenExpiry,
} from "@/app/lib/auth";
import { validateRegister } from "@/app/lib/validation";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const validationError = validateRegister({
      name,
      email,
      password,
    });

    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const verificationToken = generateToken();
    const verificationTokenHash = hashToken(verificationToken);

    const verificationTokenExpires = getTokenExpiry(15);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      isVerified: false,
      verificationToken: verificationTokenHash,
      verificationTokenExpires,
    });

    // User ko verification email bhej rahe hain.
    await sendVerificationEmail(user.email, verificationToken);

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}