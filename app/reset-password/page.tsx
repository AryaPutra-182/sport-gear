"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // user input baru
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Password dan konfirmasi tidak cocok.");
    }

    if (password.length < 6) {
      return setError("Password minimal 6 karakter.");
    }

    setIsLoading(true);

    const res = await resetPassword(email, password);

    if (res.error) {
      setError(res.error);
    } else {
      setMessage("Password berhasil diperbarui! Mengalihkan ke login...");
      setTimeout(() => router.push("/login"), 2000);
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
          <h2 className="mt-4 text-2xl font-bold text-white">Reset Password</h2>
        </div>

        <form className="space-y-6" onSubmit={handleResetPassword}>
          
          <div>
            <label className="block text-sm text-gray-300">Email Akun</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Password Baru</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Konfirmasi Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && <p className="text-green-400 text-sm">{message}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-teal-500 text-white font-bold rounded-md disabled:bg-gray-500 hover:bg-teal-600"
          >
            {isLoading ? "Menyimpan..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
