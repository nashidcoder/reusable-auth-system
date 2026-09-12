"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const pathname = usePathname();

  // Current page check karta hai.
  function isActive(path) {
    return pathname === path;
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Website logo */}
        <Link
          href="/"
          className="text-xl font-bold text-gray-900"
        >
          AuthSystem
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/login"
            className={
              isActive("/login")
                ? "rounded-lg bg-black px-4 py-2 font-medium text-white"
                : "rounded-lg px-4 py-2 text-gray-600 hover:text-black"
            }
          >
            Login
          </Link>

          <Link
            href="/register"
            className={
              isActive("/register")
                ? "rounded-lg bg-black px-4 py-2 font-medium text-white"
                : "rounded-lg px-4 py-2 text-gray-600 hover:text-black"
            }
          >
            Register
          </Link>

          <Link
            href="/dashboard"
            className={
              isActive("/dashboard")
                ? "rounded-lg bg-black px-4 py-2 font-medium text-white"
                : "rounded-lg px-4 py-2 text-gray-600 hover:text-black"
            }
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            className={
              isActive("/profile")
                ? "rounded-lg bg-black px-4 py-2 font-medium text-white"
                : "rounded-lg px-4 py-2 text-gray-600 hover:text-black"
            }
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}