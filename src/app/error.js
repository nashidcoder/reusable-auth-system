"use client";

import { useEffect } from "react";

export default function ErrorPage({ reset }) {
  useEffect(() => {
    console.error("Application error occurred.");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-900">
          Oops!
        </p>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-2 text-gray-600">
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}