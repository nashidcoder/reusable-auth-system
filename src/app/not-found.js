import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-gray-900">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-gray-600">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}