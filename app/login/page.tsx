"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginRequest } from "@/lib/api";
import { useBookingStore } from "@/store/useBookingStore"; 

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useBookingStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginRequest(email, password);

      if (res.error) {
        setError(res.error);
      } else {
        // 1. Ambil token (Support berbagai format response)
        const token = res.token || res.access_token || res.data?.token;

        if (token) {
          // 2. Simpan token ke LocalStorage
          localStorage.setItem("token", token);

          // 3. Update User ke Store Global
          const userData = res.user || res.data?.user;
          if (userData) {
            setUser(userData);
          }

          // 4. Redirect ke halaman tujuan atau produk
          const redirectTo = searchParams.get("redirect_to");
          router.push(redirectTo || "/produk");
          router.refresh(); // Refresh agar navbar merender ulang state
        } else {
          setError("Login gagal: Token tidak diterima dari server.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem, silakan coba lagi.");
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
          <h2 className="mt-4 text-2xl font-bold text-white">Login Into SportGear</h2>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full px-3 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Password"
            className="w-full px-3 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</p>}

          <button 
            disabled={isLoading}
            className="w-full py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="text-teal-400 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}