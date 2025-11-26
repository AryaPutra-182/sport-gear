"use client";

import { useState } from "react";
import Link from "next/link";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      setMessage("Email reset password telah dikirim. Periksa inbox Anda.");
    } catch (err: any) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-white">
            Sport<span className="text-teal-400">Gear</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Lupa Password</h2>
          <p className="mt-2 text-sm text-gray-400">
            Masukkan email Anda dan kami akan mengirimkan tautan reset password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handlePasswordReset}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {message && <p className="text-sm text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-md disabled:bg-gray-500"
          >
            {isLoading ? "Mengirim..." : "Kirim Tautan Reset"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Ingat password?{" "}
          <Link href="/login" className="font-medium text-teal-400 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
