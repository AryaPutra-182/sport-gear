"use client";

import Link from "next/link";
import { ArrowRightOnRectangleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

// 1. Definisikan Props yang diterima dari Navbar
interface AuthButtonProps {
  user: any;           // Data user dari store
  onLogout: () => void; // Fungsi logout dari store
}

// 2. Terima props di parameter fungsi
export default function AuthButton({ user, onLogout }: AuthButtonProps) {
  
  // LOGIC LAMA DIHAPUS:
  // - Tidak perlu useState
  // - Tidak perlu useEffect / getMe
  // - Tidak perlu useRouter (karena redirect ditangani parent atau store)

  // Jika tidak ada user, tampilkan tombol Login
  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition"
      >
        Login
      </Link>
    );
  }

  // Jika ada user, tampilkan Dashboard & Logout
  return (
    <div className="flex items-center gap-4">

      {/* Cek Role Admin */}
      {user.role === "admin" && (
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-full text-sm"
        >
          <WrenchScrewdriverIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Admin Panel</span>
        </Link>
      )}

      {/* Nama User */}
      <span className="hidden sm:block text-teal-400 font-semibold text-sm">
        {user.name || user.email}
      </span>

      {/* Tombol Logout (Panggil fungsi dari props) */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-white hover:bg-red-600 text-black py-2 px-4 rounded-full transition text-sm"
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
}