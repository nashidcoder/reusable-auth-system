"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleVerify() {
    setMessage("");

    if (!token) {
      setMessage("Verification link is invalid or expired.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md items-center">
        <div className="w-full rounded-2xl bg-white p-6 text-center shadow-lg sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Verify Your Email
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Click the button below to verify your email address.
          </p>

          {message && (
            <p className="mt-6 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-gray-600 hover:text-black"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}