
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBookingStore } from "@/store/useBookingStore";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// ... (fungsi formatCurrency biarkan sama)
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

interface Address {
  id: number; // Kita butuh ID alamat sekarang
  recipient_name: string;
  phone_number: string;
  full_address: string;
  notes?: string;
}

export default function PembayaranPage() {
  const { items, clearCart } = useBookingStore();
  const [latestAddress, setLatestAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLatestAddress = async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        setLatestAddress(data);
      }
      setIsLoading(false);
    };
    fetchLatestAddress();
  }, []);

  const totalBiayaSewa = items.reduce((total, item) => 
    total + (item.price_per_day * item.quantity * item.duration), 0);
  const biayaOngkir = 15000;
  const totalPembayaran = totalBiayaSewa + biayaOngkir;

  // --- FUNGSI BARU UNTUK MEMBUAT PESANAN ---
  const handleCreateOrder = async () => {
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !latestAddress) {
      alert("Anda harus login dan memiliki alamat untuk memesan.");
      setIsLoading(false);
      return;
    }

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: latestAddress.id,
        total_price: totalPembayaran,
        status: 'pending_payment', // Status awal
      })
      .select()
      .single();

    if (orderError) {
      alert("Gagal membuat pesanan: " + orderError.message);
      setIsLoading(false);
      return;
    }

    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity,
      duration: item.duration,
      price_at_order: item.price_per_day,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      alert("Gagal menyimpan detail pesanan: " + itemsError.message);
      // Di dunia nyata, kita perlu menghapus order yang sudah dibuat jika langkah ini gagal
      setIsLoading(false);
      return;
    }

    alert("Pesanan berhasil dibuat!");
    clearCart(); // Kosongkan keranjang
    router.push(`/status-pesanan/${orderData.id}`); // Arahkan ke halaman status pesanan
  };
  // --- AKHIR FUNGSI BARU ---

  if (isLoading && !latestAddress) {
    return <div className="flex justify-center items-center h-screen bg-[#0D1117] text-white">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* ... (kode JSX lainnya tidak berubah) ... */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 space-y-6">
                {/* ... Detail Pengiriman & Rincian Produk ... */}
            </div>
            <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6 space-y-4">
                {/* ... Ringkasan Pesanan & Metode Pembayaran ... */}

                {/* GANTI TOMBOL INI */}
                <button 
                  onClick={handleCreateOrder}
                  disabled={isLoading || items.length === 0}
                  className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Memproses...' : 'Pay Now'}
                </button>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}