// Next.js ka response helper import kar rahe hain.
import { NextResponse } from "next/server";

// MongoDB connection function import kar rahe hain.
import { connectDB } from "@/app/lib/db";

// User model import kar rahe hain.
import User from "@/models/User";

// Session model import kar rahe hain.
import Session from "@/models/Session";

// Authentication functions import kar rahe hain.
import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  generateToken,
  hashToken,
} from "@/app/lib/auth";

// Login validation import kar rahe hain.
import { validateLogin } from "@/app/lib/validation";

// Login API ka POST function.
export async function POST(request) {
  try {
    // Request body se email aur password nikal rahe hain.
    const { email, password } = await request.json();

    // Login data validate kar rahe hain.
    const validationError = validateLogin({
      email,
      password,
    });

    // Validation fail ho to error return karenge.
    if (validationError) {
      return NextResponse.json(
        {
          message: validationError,
        },
        {
          status: 400,
        }
      );
    }

    // MongoDB se connect kar rahe hain.
    await connectDB();

    // Email ko clean aur lowercase kar rahe hain.
    const cleanEmail = email.trim().toLowerCase();

    // User ko database mein find kar rahe hain.
    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    // User nahi mila ya password available nahi hai.
    if (!user || !user.password) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    // Password compare kar rahe hain.
    const passwordMatched = await comparePassword(
      password,
      user.password
    );

    // Password incorrect ho to error return karenge.
    if (!passwordMatched) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    // Email verify nahi hui to login rok denge.
    if (!user.isVerified) {
      return NextResponse.json(
        {
          message:
            "Please verify your email before logging in.",
        },
        {
          status: 403,
        }
      );
    }

    // New refresh-token family ID generate kar rahe hain.
    const familyId = generateToken();

    // Temporary session create kar rahe hain.
    const session = await Session.create({
      userId: user._id,

      refreshTokenHash: "temporary",

      familyId,

      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    // Session ID nikal rahe hain.
    const sessionId = session._id.toString();

    // Access token create kar rahe hain.
    const accessToken = await createAccessToken(user);

    // Refresh token create kar rahe hain.
    const refreshToken = await createRefreshToken(
      user,
      sessionId
    );

    // Refresh token ki hash bana rahe hain.
    const refreshTokenHash = hashToken(refreshToken);

    // Session mein actual refresh token hash save kar rahe hain.
    session.refreshTokenHash = refreshTokenHash;

    // Session database mein save kar rahe hain.
    await session.save();

    // Successful login response create kar rahe hain.
    const response = NextResponse.json(
      {
        message: "Login successful.",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      {
        status: 200,
      }
    );

    // Access token ko HTTP-only cookie mein save kar rahe hain.
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    // Refresh token ko HTTP-only cookie mein save kar rahe hain.
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Final response browser ko return kar rahe hain.
    return response;
  } catch (error) {
    // Error terminal mein show kar rahe hain.
    console.error("Login error:", error);

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