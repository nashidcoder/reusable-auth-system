import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/currentUser";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  // Login aur current user check helper karega.
  const user = await getCurrentUser();

  // Sirf admin ko access milega.
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome, {user.name}.
          </p>

          <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">
              Role
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {user.role}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}