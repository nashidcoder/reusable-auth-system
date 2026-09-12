import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import {
  verifyAccessToken,
  comparePassword,
  hashPassword,
} from "@/app/lib/auth";
import { validateResetPassword } from "@/app/lib/validation";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Please login first." },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload?.sub) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    const validationError = validateResetPassword({
      password: newPassword,
    });

    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(payload.sub).select("+password");

    if (!user || user.sessionVersion !== Number(payload.sessionVersion)) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const passwordMatched = await comparePassword(
      currentPassword,
      user.password
    );

    if (!passwordMatched) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 400 }
      );
    }

    user.password = await hashPassword(newPassword);

    // Password change ke baad purani sessions revoke.
    user.sessionVersion += 1;

    await user.save();

    await Session.updateMany(
      { userId: user._id },
      { $set: { revoked: true } }
    );

    const response = NextResponse.json(
      { message: "Password changed successfully. Please login again." },
      { status: 200 }
    );

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
    console.error("Change password error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}