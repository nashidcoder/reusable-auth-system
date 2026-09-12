import { getCurrentUser } from "@/app/lib/currentUser";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  // Current logged-in user reusable helper se mil raha hai.
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>

              <p className="font-medium text-gray-900">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>

              <p className="font-medium text-gray-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Role</p>

              <p className="font-medium text-gray-900">
                {user.role}
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}