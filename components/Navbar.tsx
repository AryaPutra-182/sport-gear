"use client";

import Link from "next/link";
import { ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useBookingStore } from "@/store/useBookingStore";
import { useEffect, useState } from "react";
import AuthButton from "./AuthButton";
import { getMe } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { items, user, setUser, logout } = useBookingStore((state) => state);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- DEBUGGING EFFECT ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("1. [Navbar] Cek Token di Storage:", token);

    if (token && !user) {
      // console.log("2. [Navbar] Token ada, tapi User kosong. Memanggil getMe()...");
      
      getMe()
        .then((res) => {
          if (!res || res.error || res.success === false) {
            logout(); 
          } else {
            setUser(res.data || res.user || res); 
          }
        })
        .catch((err) => {
          console.error("4. [Navbar] Error Fetch:", err);
          logout();
        });
    }
  }, [user, setUser, logout]);

  const handleProtectedRoute = (path: string) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push(`/login?redirect_to=${path}`);
      return;
    }
    
    router.push(path);
  };

  const whatsappNumber = "6281234567890";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <nav className="bg-[#122D4F] py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Rentletics
        </Link>

        {/* Menu Tengah */}
        <div className="hidden md:flex space-x-8">
          <Link href="/produk" className="text-white hover:text-teal-400 transition-colors">Produk</Link>
          <a href={whatsappUrl} target="_blank" className="text-white hover:text-teal-400 transition-colors">Chat</a>
          <button onClick={() => handleProtectedRoute("/pesanan_saya")} className="text-white hover:text-teal-400 transition-colors">Pesanan Saya</button>
        </div>

        {/* Menu Kanan (Cart, Profile, Auth) */}
        <div className="flex items-center space-x-4">
          
          {/* Tombol Keranjang */}
          <button onClick={() => handleProtectedRoute("/keranjang")} className="relative flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition-colors">
            <ShoppingCartIcon className="h-5 w-5" />
            {isMounted && items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#122D4F] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>

          {/* ✅ Tombol Profile (Hanya muncul jika User Login) */}
          {isMounted && user && (
            <button 
                onClick={() => handleProtectedRoute("/profile")} 
                className="text-white hover:text-teal-400 transition-colors"
                title="Profil Saya"
            >
                <UserCircleIcon className="h-9 w-9" />
            </button>
          )}

          {/* Tombol Login/Logout */}
          {isMounted && <AuthButton user={user} onLogout={logout} />}
        </div>
      </div>
    </nav>
  );
}