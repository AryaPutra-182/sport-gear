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
        const token = res.token || res.access_token || res.data?.token;

        if (token) {
          localStorage.setItem("token", token);
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

          const userData = res.user || res.data?.user;
          if (userData) {
            setUser(userData);
          }

          if (userData?.role === 'admin') {
             router.push("/admin/dashboard");
          } else {
             const redirectTo = searchParams.get("redirect_to");
             router.push(redirectTo || "/produk");
          }
          
          router.refresh(); 
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
    // ✅ Background Cream
    <div className="flex items-center justify-center min-h-screen bg-[#F7F5E9] px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-200">
        
        {/* Header Logo */}
        <div className="text-center">
          <Link href="/" className="text-4xl font-extrabold text-[#122D4F]">
            Rentletics
          </Link>
          <h2 className="mt-4 text-xl font-medium text-gray-600">
            Welcome back! Please login.
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-[#122D4F] mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-[#122D4F] mb-2">Password</label>
            <input
              type="password"
              required
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
            disabled={isLoading}
            className={`w-full py-3.5 font-bold rounded-lg transition-all shadow-md transform hover:-translate-y-0.5 ${
                isLoading 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-[#F4B400] hover:bg-[#e0a500] text-[#122D4F] hover:shadow-lg"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-600 text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#122D4F] font-bold hover:text-[#F4B400] transition underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F7F5E9] text-[#122D4F]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}