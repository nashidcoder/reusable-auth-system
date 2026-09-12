import Link from "next/link";
import { getCurrentUser } from "@/app/lib/currentUser";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  // Reusable helper current logged-in user check karega.
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            You are successfully logged in.
          </p>

          <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">
              Logged-in User
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {user.name}
            </p>

            <p className="mt-1 text-gray-600">
              {user.email}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
            >
              My Profile
            </Link>

            <Link
              href="/change-password"
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </Link>

            {user.role === "admin" && (
              <Link
                href="/admin"
                className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}