"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBookingStore } from "@/store/useBookingStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function KeranjangPage() {
  const router = useRouter();
  
  const { items, removeItem } = useBookingStore((state) => state);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect_to=/keranjang");
    }
  }, [router]);

  const totalBiayaSewa = items.reduce(
    (total, item) => {
        const price = item.price || 0; 
        const duration = item.duration || 1;
        const qty = item.quantity || 1;
        return total + (price * duration * qty);
    },
    0
  );

  const biayaOngkir = 15000;
  const totalPembayaran = totalBiayaSewa + biayaOngkir;

  if (!isMounted) return null;

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-[#122D4F] text-center mb-10">
          Keranjang Sewa Anda
        </h1>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* 🧺 List Produk */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-200 pb-6 last:border-none"
                >
                  {/* Gambar Produk */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Detail Produk */}
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-bold text-[#122D4F]">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      Harga: {formatCurrency(item.price || 0)} / hari
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-sm">
                       <span className="bg-[#F7F5E9] text-[#122D4F] px-3 py-1 rounded-full border border-[#122D4F]/10 font-medium">
                           {item.duration || 1} Hari
                       </span>
                       <span className="bg-[#F7F5E9] text-[#122D4F] px-3 py-1 rounded-full border border-[#122D4F]/10 font-medium">
                           Qty: {item.quantity || 1}
                       </span>
                    </div>
                  </div>

                  {/* Total per Item & Hapus */}
                  <div className="flex flex-col items-center sm:items-end gap-3">
                    <p className="text-[#122D4F] font-extrabold text-lg">
                      {formatCurrency((item.price || 0) * (item.duration || 1) * (item.quantity || 1))}
                    </p>
                    
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 📦 Ringkasan */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4 sticky top-24">
              <h2 className="text-xl font-bold text-[#122D4F] border-b border-gray-200 pb-3">
                Ringkasan Pesanan
              </h2>

              <div className="flex justify-between text-gray-600 font-medium">
                <span>Total Biaya Sewa</span>
                <span>{formatCurrency(totalBiayaSewa)}</span>
              </div>

              <div className="flex justify-between text-gray-600 font-medium">
                <span>Biaya Ongkir (Estimasi)</span>
                <span>{formatCurrency(biayaOngkir)}</span>
              </div>

              <div className="flex justify-between text-xl font-bold text-[#122D4F] border-t border-gray-200 pt-4">
                <span>Total Pembayaran</span>
                <span className="text-[#F4B400]">{formatCurrency(totalPembayaran)}</span>
              </div>

              <Link href="/checkout/alamat" className="block w-full">
                <button className="w-full mt-4 bg-[#F4B400] hover:bg-[#e0a500] text-[#122D4F] font-bold py-4 rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Lanjut ke Pembayaran
                </button>
              </Link>
            </div>
          </div>
        ) : (
          // --- TAMPILAN KOSONG ---
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#122D4F]">Keranjang Anda Kosong</h2>
            <p className="text-gray-500 mt-2 font-medium">Belum ada barang yang disewa.</p>

            <Link
              href="/produk"
              className="mt-8 inline-block bg-[#122D4F] hover:bg-[#0C2E4E] text-white font-bold py-3 px-8 rounded-full transition shadow-lg hover:shadow-xl"
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