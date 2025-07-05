// app/components/Navbar.tsx

"use client";

import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useBookingStore } from '@/store/useBookingStore';
import { useEffect, useState } from 'react';
import AuthButton from './AuthButton'; // <-- 1. Impor komponen baru

export default function Navbar() {
  const items = useBookingStore((state) => state.items);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="bg-transparent py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Sport<span className="text-teal-400">Gear</span>
        </Link>

        {/* Menu Navigasi Tengah */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-300 hover:text-teal-400 transition-colors">Home</Link>
          <Link href="/chat" className="text-gray-300 hover:text-teal-400 transition-colors">Chat</Link>
          <Link href="/features" className="text-gray-300 hover:text-teal-400 transition-colors">Features</Link>
        </div>

        {/* Tombol Aksi Kanan */}
        <div className="flex items-center space-x-4">
          {/* Tombol Keranjang */}
          <Link href="/keranjang" className="relative flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition-colors">
            <ShoppingCartIcon className="h-5 w-5" />
            {isClient && items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {/* 2. Ganti tombol profile lama dengan komponen AuthButton */}
          <AuthButton />
          
        </div>
      </div>
    </nav>
  );
}