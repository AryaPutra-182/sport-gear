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
        setModal({ open:true, msg:"Pendaftaran berhasil! Silakan login." });
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mendaftar.");
    } finally {
      setIsLoading(false);
    }
  };
  const [modal, setModal] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });


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
            <label className="block text-sm font-bold text-[#122D4F] mb-2">
              Nama Lengkap
            </label>
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
            <label className="block text-sm font-bold text-[#122D4F] mb-2">
              Email Address
            </label>
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
            <label className="block text-sm font-bold text-[#122D4F] mb-2">
              Password
            </label>
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
          <Link
            href="/login"
            className="font-bold text-[#122D4F] hover:text-[#F4B400] transition underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-xl border border-gray-200 animate-fadeIn
                    transform transition-all scale-100"
          >
            {/* Icon success */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#122D4F] text-center mb-2">
              Berhasil
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {modal.msg}
            </p>

            {/* Confirm Button */}
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm 
                   bg-[#122D4F] hover:bg-[#0f223c] transition shadow-md hover:shadow-lg"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}