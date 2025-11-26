"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBookingStore } from "@/store/useBookingStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

// Format harga ke Rupiah
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function KeranjangPage() {
  const router = useRouter();
  
  // 1. Ambil items dan action removeItem dari Store
  const { items, removeItem } = useBookingStore((state) => state);
  
  // 2. State untuk mencegah Hydration Error (Next.js server vs client mismatch)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Komponen sudah load di browser
    
    // 🔐 Protect Route
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect_to=/keranjang");
    }
  }, [router]);

  // Hitung total biaya sewa
  const totalBiayaSewa = items.reduce(
    (total, item) => {
        // Pastikan properti price ada (fallback ke 0 jika error)
        const price = item.price || 0; 
        const duration = item.duration || 1;
        const qty = item.quantity || 1;
        return total + (price * duration * qty);
    },
    0
  );

  const biayaOngkir = 15000;
  const totalPembayaran = totalBiayaSewa + biayaOngkir;

  // Cegah render sebelum mounted agar tidak error hydration
  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Keranjang Sewa Anda
        </h1>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* 🧺 List Produk */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-700 pb-6 last:border-none"
                >
                  {/* Gambar Produk */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"} // Gunakan item.image sesuai store
                      alt={item.name}
                      fill
                      className="rounded-md object-cover bg-gray-700"
                    />
                  </div>

                  {/* Detail Produk */}
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Harga: {formatCurrency(item.price || 0)} / hari
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-300">
                       <span className="bg-gray-700 px-2 py-1 rounded">Durasi: {item.duration || 1} Hari</span>
                       <span className="bg-gray-700 px-2 py-1 rounded">Qty: {item.quantity || 1}</span>
                    </div>
                  </div>

                  {/* Total per Item & Hapus */}
                  <div className="flex flex-col items-center sm:items-end gap-2">
                    <p className="text-teal-400 font-bold text-lg">
                      {formatCurrency((item.price || 0) * (item.duration || 1) * (item.quantity || 1))}
                    </p>
                    
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 📦 Ringkasan */}
            <div className="bg-gray-800 rounded-lg p-6 space-y-4 sticky top-4">
              <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3">
                Ringkasan Pesanan
              </h2>

              <div className="flex justify-between text-gray-300">
                <span>Total Biaya Sewa</span>
                <span>{formatCurrency(totalBiayaSewa)}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Biaya Ongkir (Estimasi)</span>
                <span>{formatCurrency(biayaOngkir)}</span>
              </div>

              <div className="flex justify-between text-xl font-bold text-white border-t border-gray-700 pt-3">
                <span>Total Pembayaran</span>
                <span className="text-teal-400">{formatCurrency(totalPembayaran)}</span>
              </div>

              <Link href="/checkout/alamat" className="block w-full">
                <button className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-teal-500/20">
                  Lanjut ke Pembayaran
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white">Keranjang Anda Kosong</h2>
            <p className="text-gray-400 mt-2">Belum ada barang yang disewa.</p>

            <Link
              href="/produk"
              className="mt-6 inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition"
            >
              Cari Produk
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}