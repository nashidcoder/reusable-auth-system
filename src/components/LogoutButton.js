"use client";

// React se useState import kar rahe hain.
import { useState } from "react";

// Page navigation ke liye useRouter import kar rahe hain.
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  // Logout ke waqt loading state control karne ke liye.
  const [loading, setLoading] = useState(false);

  // Next.js router.
  const router = useRouter();

  // Logout handle karne wala function.
  async function handleLogout() {
    // Button ko loading state mein kar rahe hain.
    setLoading(true);

    try {
      // Logout API ko POST request bhej rahe hain.
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Agar API successful nahi hui to error throw karenge.
      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      // User ko login page par redirect kar rahe hain.
      router.push("/login");

      // Authentication state refresh kar rahe hain.
      router.refresh();
    } catch (error) {
      // Error terminal mein show karenge.
      console.error("Logout error:", error);
    } finally {
      // Loading state khatam kar rahe hain.
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="mt-6 rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}