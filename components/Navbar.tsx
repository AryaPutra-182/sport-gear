"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
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
    console.log("1. [Navbar] Cek Token di Storage:", token);

    if (token && !user) {
      console.log("2. [Navbar] Token ada, tapi User kosong. Memanggil getMe()...");
      
      getMe()
        .then((res) => {
          console.log("3. [Navbar] Response getMe:", res);

          // Cek response sesuai struktur API Laravel/Backend Anda
          if (!res || res.error || res.success === false) {
            console.error("4. [Navbar] Gagal validasi user. Melakukan Logout paksa.");
            logout(); 
          } else {
            console.log("4. [Navbar] Sukses! Set User ke store.");
            setUser(res.data || res.user || res); 
          }
        })
        .catch((err) => {
          console.error("4. [Navbar] Error Fetch:", err);
          logout();
        });
    } else {
      console.log("2. [Navbar] Tidak perlu fetch (Token kosong atau User sudah ada)");
    }
  }, [user, setUser, logout]);

 const handleProtectedRoute = (path: string) => {
    // Ambil token langsung dari storage saat tombol diklik
    const token = localStorage.getItem("token");
    
    // Debugging: Cek apakah token terbaca
    console.log("Token saat klik:", token);

    if (!token) {
      router.push(`/login?redirect_to=${path}`);
      return;
    }
    
    router.push(path);
};

  // ... (Sisa kode return JSX sama seperti sebelumnya) ...
  // Pastikan Anda menyertakan return JSX lengkapnya di sini
  const whatsappNumber = "6281234567890";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <nav className="bg-transparent py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Sport<span className="text-teal-400">Gear</span>
        </Link>

        <div className="hidden md:flex space-x-8">
          <Link href="/produk" className="text-gray-300 hover:text-teal-400 transition-colors">Produk</Link>
          <a href={whatsappUrl} target="_blank" className="text-gray-300 hover:text-teal-400 transition-colors">Chat</a>
          <button onClick={() => handleProtectedRoute("/pesanan_saya")} className="text-gray-300 hover:text-teal-400 transition-colors">Pesanan Saya</button>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={() => handleProtectedRoute("/keranjang")} className="relative flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition-colors">
            <ShoppingCartIcon className="h-5 w-5" />
            {isMounted && items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{items.length}</span>
            )}
          </button>
          {isMounted && <AuthButton user={user} onLogout={logout} />}
        </div>
      </div>
    </nav>
  );
}