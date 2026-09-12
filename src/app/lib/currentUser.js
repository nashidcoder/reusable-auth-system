import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import User from "@/models/User";

export async function getCurrentUser() {
  try {
    // Browser ki HTTP-only access cookie le rahe hain.
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // Login nahi hai to login page par bhejenge.
    if (!accessToken) {
      redirect("/login");
    }

    // Access token verify kar rahe hain.
    const payload = await verifyAccessToken(accessToken);

    if (!payload?.sub) {
      redirect("/login");
    }

    // Database se current user le rahe hain.
    await connectDB();

    const user = await User.findById(payload.sub);

    // User ya session valid nahi hai.
    if (
      !user ||
      user.sessionVersion !== Number(payload.sessionVersion)
    ) {
      redirect("/login");
    }

    return user;
  } catch (error) {
    redirect("/login");
  }
}