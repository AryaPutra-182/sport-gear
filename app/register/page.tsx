"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await registerRequest(fullName, email, password);

      if (res.error) {
        setError(res.error);
      } else {
        alert("Pendaftaran berhasil! Silakan login.");
        router.push("/login");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mendaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-white">
            Sport<span className="text-teal-400">Gear</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Sign Up</h2>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-300">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email address</label>
            <input
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:bg-gray-500"
          >
            {isLoading ? "Mendaftarkan..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-teal-400 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
