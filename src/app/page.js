import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-4">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl items-center justify-center text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Reusable Authentication
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Secure Authentication System
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            A simple, secure and reusable authentication system
            built with Next.js, MongoDB and JavaScript.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}