"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

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

    // Dapatkan URL dasar dari environment variable atau window.location
    const redirectURL = window.location.origin + '/reset-password';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL,
    });

    if (error) {
      setError("Gagal mengirim email reset password: " + error.message);
    } else {
      setMessage("Email untuk reset password telah dikirim. Silakan periksa inbox Anda.");
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
          <h2 className="mt-4 text-2xl font-bold text-white">
            Lupa Password
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset password Anda.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handlePasswordReset}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          {message && <p className="text-sm text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-500"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          Ingat password Anda?{' '}
          <Link href="/login" className="font-medium text-teal-400 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}