// Next.js ka response helper import kar rahe hain.
import { NextResponse } from "next/server";

// Cookies read karne ke liye cookies import kar rahe hain.
import { cookies } from "next/headers";

// MongoDB connection function import kar rahe hain.
import { connectDB } from "@/app/lib/db";

// Session model import kar rahe hain.
import Session from "@/models/Session";

// Refresh token verify aur hash karne wale functions import kar rahe hain.
import {
  verifyRefreshToken,
  hashToken,
} from "@/app/lib/auth";

// Logout API ka POST function.
export async function POST() {
  try {
    // Browser ki cookies read kar rahe hain.
    const cookieStore = await cookies();

    // Refresh token cookie se nikal rahe hain.
    const refreshToken =
      cookieStore.get("refreshToken")?.value;

    // Agar refresh token maujood hai to MongoDB session revoke karenge.
    if (refreshToken) {
      try {
        // MongoDB se connect kar rahe hain.
        await connectDB();

        // Refresh token verify kar rahe hain.
        const payload = await verifyRefreshToken(refreshToken);

        // Token ke andar se session ID nikal rahe hain.
        const sessionId = payload?.sid;

        // Agar session ID mil gayi hai.
        if (sessionId) {
          // Refresh token ki SHA-256 hash bana rahe hain.
          const refreshTokenHash = hashToken(refreshToken);

          // Current session ko revoke kar rahe hain.
          await Session.updateOne(
            {
              _id: sessionId,
              refreshTokenHash,
            },
            {
              $set: {
                revoked: true,
              },
            }
          );
        }
      } catch (error) {
        // Token invalid ya expired ho to bhi logout complete hoga.
        console.log("Session revoke skipped.");
      }
    }

    // Successful logout response create kar rahe hain.
    const response = NextResponse.json(
      {
        message: "Logout successful.",
      },
      {
        status: 200,
      }
    );

    // Access token cookie remove kar rahe hain.
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    // Refresh token cookie remove kar rahe hain.
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    // Response browser ko return kar rahe hain.
    return response;
  } catch (error) {
    // Unexpected error terminal mein show karenge.
    console.error("Logout error:", error);

    // Error response return karenge.
    return NextResponse.json(
      {
        message: "Something went wrong during logout.",
      },
      {
        status: 500,
      }
    );
  }
}