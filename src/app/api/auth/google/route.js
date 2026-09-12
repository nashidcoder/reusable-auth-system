import crypto from "crypto";
import { NextResponse } from "next/server";

// Google login start karne ka route.
export async function GET() {
  // OAuth CSRF protection ke liye random state.
  const state = crypto.randomBytes(32).toString("hex");

  // Google authorization URL.
  const googleUrl = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth"
  );

  googleUrl.searchParams.set(
    "client_id",
    process.env.GOOGLE_CLIENT_ID
  );

  googleUrl.searchParams.set(
    "redirect_uri",
    process.env.GOOGLE_REDIRECT_URI
  );

  googleUrl.searchParams.set("response_type", "code");

  // Sirf login ke liye required basic information.
  googleUrl.searchParams.set(
    "scope",
    "openid email profile"
  );

  // Google se state wapas milegi.
  googleUrl.searchParams.set("state", state);

  // User ko Google login page par bhej rahe hain.
  const response = NextResponse.redirect(googleUrl);

  // State ko secure HTTP-only cookie mein save kar rahe hain.
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  return response;
}