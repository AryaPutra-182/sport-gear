// app/keranjang/page.tsx

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBookingStore } from "@/store/useBookingStore";
import Image from "next/image";
import Link from "next/link";

// Fungsi untuk format harga ke Rupiah
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function KeranjangPage() {
  const { items } = useBookingStore();

  // Menghitung total biaya sewa
  const totalBiayaSewa = items.reduce((total, item) => {
    return total + (item.price_per_day * item.quantity * item.duration);
  }, 0);

  // Biaya lain-lain (bisa dibuat dinamis nanti)
  const biayaOngkir = 15000;
  const totalPembayaran = totalBiayaSewa + biayaOngkir;

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Keranjang Sewa Anda
        </h1>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Kolom Kiri: Daftar Item */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-700 pb-4 last:border-b-0">
                  <Image src={item.image_url} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">Durasi: {item.duration} hari</p>
                    <p className="text-sm text-gray-400">Jumlah: {item.quantity}</p>
                  </div>
                  <p className="text-md font-semibold text-white">
                    {formatCurrency(item.price_per_day * item.quantity * item.duration)}
                  </p>
                </div>
              ))}
            </div>

            {/* Kolom Kanan: Ringkasan Pesanan */}
            <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3">Ringkasan Pesanan</h2>
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
                <span>{formatCurrency(totalPembayaran)}</span>
              </div>
              <Link href="/checkout/alamat" className="block w-full">
    <button className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors">
      Lanjut ke Pembayaran
    </button>
  </Link>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold text-white">Keranjang Anda Kosong</h2>
            <p className="text-gray-400 mt-2">Ayo mulai sewa beberapa peralatan olahraga!</p>
            <Link href="/produk" className="mt-6 inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Lihat Produk
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}