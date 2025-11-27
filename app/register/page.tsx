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
    // ✅ Background Cream
    <div className="flex items-center justify-center min-h-screen bg-[#F7F5E9] px-4">
      {/* Card Putih dengan Shadow */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
        
        {/* Header Logo */}
        <div className="text-center">
          <Link href="/" className="text-4xl font-extrabold text-[#122D4F]">
            Rentletics
          </Link>
          <h2 className="mt-4 text-xl font-medium text-gray-600">
            Create your account
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-bold text-[#122D4F] mb-2">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition placeholder-gray-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#122D4F] mb-2">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-[#122D4F] mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 font-bold rounded-lg transition-all shadow-md transform hover:-translate-y-0.5 ${
                isLoading 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-[#F4B400] hover:bg-[#e0a500] text-[#122D4F] hover:shadow-lg"
            }`}
          >
            {isLoading ? "Mendaftarkan..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#122D4F] hover:text-[#F4B400] transition underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}