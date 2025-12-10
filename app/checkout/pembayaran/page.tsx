"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBookingStore } from "@/store/useBookingStore";
import { useRouter } from "next/navigation";
import { getLatestAddress, createOrder } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function PembayaranPage() {
  const router = useRouter();
  const { items, clearCart } = useBookingStore();

  const [latestAddress, setLatestAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Hitung Total (Dengan Safety Check)
  const totalBiayaSewa = items.reduce((total, item) => {
    const price = item.price || (item as any).price_per_day || 0;
    const duration = item.duration || 1;
    const quantity = item.quantity || 1;
    return total + (price * duration * quantity);
  }, 0);

  const biayaOngkir = 10000;
  const totalPembayaran = totalBiayaSewa + biayaOngkir;

  useEffect(() => {
    setIsMounted(true);

    async function fetchAddress() {
      try {
        const res = await getLatestAddress();
        
        if (res?.status === 401 || res?.error === "Unauthorized") {
          router.push("/login?redirect_to=/checkout/pembayaran");
          return;
        }

        let addressData = res?.data || res;
        if (Array.isArray(addressData)) {
            addressData = addressData.length > 0 ? addressData[0] : null;
        }

        if (addressData && addressData.id) {
          setLatestAddress(addressData);
        } else {
          setLatestAddress(null);
        }

      } catch (error) {
        console.error("❌ Gagal mengambil alamat:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAddress();
  }, [router]);

  const handleCreateOrder = async () => {
    if (!latestAddress) return;
    setLoading(true);

    try {
      const payload = {
        addressId: latestAddress.id,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          duration: item.duration,
        })),
        totalPrice: totalPembayaran,
      };

      const res = await createOrder(payload);

      if (res.error) {
        alert("Gagal membuat pesanan: " + res.error);
        setLoading(false);
        return; 
      }

      clearCart();
      router.push(`/status-pesanan/${res.data?.id || res.id}`);

    } catch (error) {
      console.error("❌ Error create order:", error);
      alert("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F7F5E9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#122D4F]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="container mx-auto flex-grow px-6 py-12">
        <h1 className="text-3xl font-extrabold text-[#122D4F] mb-8">Checkout & Pembayaran</h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">

            {/* KARTU ALAMAT (Putih + Shadow) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#122D4F] text-xl font-bold">Alamat Pengiriman</h2>
                <Link href="/checkout/alamat" className="text-[#122D4F] text-sm hover:text-[#F4B400] font-medium underline transition-colors">
                  {latestAddress ? "Ubah Alamat" : "Tambah Alamat"}
                </Link>
              </div>

              {latestAddress ? (
                <div className="text-gray-600 space-y-1">
                  <p className="font-bold text-[#122D4F] text-lg">
                    {latestAddress.recipientName || latestAddress.recipient_name}
                    <span className="text-gray-500 ml-2 font-normal text-sm"> 
                        | {latestAddress.phoneNumber || latestAddress.phone_number}
                    </span>
                  </p>
                  <p>{latestAddress.fullAddress || latestAddress.full_address}</p>
                  
                  {latestAddress.notes && (
                    <p className="text-sm italic text-gray-500 mt-2 bg-gray-50 p-2 rounded inline-block">"Catatan: {latestAddress.notes}"</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#F7F5E9] rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">⚠️ Anda belum mengatur alamat pengiriman</p>
                  <Link href="/checkout/alamat" className="bg-[#122D4F] hover:bg-[#0C2E4E] text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md">
                    Tambah Alamat Baru
                  </Link>
                </div>
              )}
            </div>

            {/* DETAIL BARANG (Putih + Shadow) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-[#122D4F] text-xl font-bold mb-6">Detail Barang</h2>

              {items.map((item) => {
                const itemPrice = item.price || (item as any).price_per_day || 0;
                
                return (
                  <div key={item.id} className="flex items-center gap-6 border-b border-gray-100 pb-6 mb-6 last:border-none last:mb-0 last:pb-0">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image 
                        src={item.image || "/placeholder.png"} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[#122D4F] font-bold text-lg">{item.name}</p>
                      <div className="text-sm text-gray-500 flex gap-3 mt-2">
                        <span className="bg-[#F7F5E9] text-[#122D4F] px-3 py-1 rounded-full text-xs font-medium border border-[#122D4F]/10">{item.duration} Hari</span>
                        <span className="bg-[#F7F5E9] text-[#122D4F] px-3 py-1 rounded-full text-xs font-medium border border-[#122D4F]/10">x{item.quantity}</span>
                      </div>
                    </div>
                    <p className="text-[#122D4F] font-bold text-lg">
                      {formatCurrency(itemPrice * (item.duration || 1) * (item.quantity || 1))}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUMMARY PEMBAYARAN (Sticky) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-24">
            <h2 className="text-[#122D4F] text-xl font-bold mb-6 border-b border-gray-100 pb-4">Rincian Pembayaran</h2>

            <div className="flex justify-between text-gray-600 mb-3 font-medium">
              <span>Total Biaya Sewa</span>
              <span>{formatCurrency(totalBiayaSewa)}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-6 font-medium">
              <span>Biaya Pengiriman</span>
              <span>{formatCurrency(biayaOngkir)}</span>
            </div>

            <div className="border-t border-gray-200 my-4 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-[#122D4F] font-bold text-lg">Total Bayar</span>
                    <span className="text-[#F4B400] text-2xl font-extrabold">{formatCurrency(totalPembayaran)}</span>
                </div>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={loading || items.length === 0 || !latestAddress}
              className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 ${
                loading || items.length === 0 || !latestAddress
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-[#F4B400] hover:bg-[#e0a500] text-[#122D4F] hover:shadow-lg"
              }`}
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
            
            {!latestAddress && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-500 text-xs text-center font-medium">
                        *Mohon lengkapi alamat pengiriman terlebih dahulu
                    </p>
                </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}