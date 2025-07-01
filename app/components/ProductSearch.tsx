// app/components/ProductSearch.tsx

"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter(); // Hook untuk mengontrol navigasi

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return; // Jangan lakukan apa-apa jika input kosong

    // Arahkan ke halaman produk dengan query pencarian di URL
    router.push(`/produk?q=${query}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari raket, bola, sepatu..."
            className="w-full pl-10 pr-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 font-semibold text-white bg-gray-700 rounded-full hover:bg-teal-500 transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          // Logika kategori akan kita tambahkan nanti
          className="px-6 py-3 font-semibold text-white bg-teal-500 rounded-full hover:bg-teal-600 transition-colors"
        >
          Category
        </button>
      </form>
    </div>
  );
}