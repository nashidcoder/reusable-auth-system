// Next.js ka response helper import kar rahe hain.
import { NextResponse } from "next/server";

// MongoDB connection function import kar rahe hain.
import { connectDB } from "@/app/lib/db";

// User model import kar rahe hain.
import User from "@/models/User";

// Token hash karne ke liye function import kar rahe hain.
import { hashToken } from "@/app/lib/auth";

export async function POST(request) {
  try {
    // Request body se verification token nikal rahe hain.
    const { token } = await request.json();

    // Token missing ho to error return karenge.
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        {
          message: "Verification token is required.",
        },
        {
          status: 400,
        }
      );
    }

    // MongoDB se connect kar rahe hain.
    await connectDB();

    // Browser se milne wale token ki hash bana rahe hain.
    const verificationTokenHash = hashToken(token);

    // Valid aur non-expired verification token wala user find kar rahe hain.
    const user = await User.findOne({
      verificationToken: verificationTokenHash,

      verificationTokenExpires: {
        $gt: new Date(),
      },
    });

    // Agar user nahi mila to token invalid ya expired hai.
    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired verification token.",
        },
        {
          status: 400,
        }
      );
    }

    // Agar email pehle hi verify ho chuki hai.
    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "Email is already verified.",
        },
        {
          status: 200,
        }
      );
    }

    // User ko verified mark kar rahe hain.
    user.isVerified = true;

    // Verification token remove kar rahe hain.
    user.verificationToken = undefined;

    // Token expiry bhi remove kar rahe hain.
    user.verificationTokenExpires = undefined;

    // Changes database mein save kar rahe hain.
    await user.save();

    // Successful verification response.
    return NextResponse.json(
      {
        message: "Email verified successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Error terminal mein show karenge.
    console.error("Email verification error:", error);

    // Generic error response.
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}