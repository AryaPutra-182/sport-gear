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

  const biayaOngkir = 15000;
  const totalPembayaran = totalBiayaSewa + biayaOngkir;

  useEffect(() => {
    setIsMounted(true);

    async function fetchAddress() {
      try {
        const res = await getLatestAddress();
        console.log("📦 Response API Address:", res);

        if (res?.status === 401 || res?.error === "Unauthorized") {
          router.push("/login?redirect_to=/checkout/pembayaran");
          return;
        }

        // Normalisasi data (Object atau Array)
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
      // ✅ FIX PAYLOAD: Gunakan camelCase agar sesuai dengan Prisma Backend
      const payload = {
        addressId: latestAddress.id, // address_id -> addressId
        items: items.map((item) => ({
          productId: item.id,        // product_id -> productId
          quantity: item.quantity,
          duration: item.duration,
        })),
        totalPrice: totalPembayaran, // total_price -> totalPrice
      };

      console.log("📤 Sending Payload:", payload);

      const res = await createOrder(payload);

      if (res.error) {
        alert("Gagal membuat pesanan: " + res.error);
        setLoading(false);
        return; 
      }

      // Sukses
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
      <div className="flex justify-center items-center min-h-screen text-white bg-[#0D1117]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mr-3"></div>
        Memuat data...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="container mx-auto flex-grow px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout & Pembayaran</h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">

            {/* KARTU ALAMAT */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-bold">Alamat Pengiriman</h2>
                <Link href="/checkout/alamat" className="text-teal-400 text-sm hover:underline">
                  {latestAddress ? "Ubah Alamat" : "Tambah Alamat"}
                </Link>
              </div>

              {latestAddress ? (
                <div className="text-gray-300 space-y-1">
                  <p className="font-bold text-white">
                    {/* Support snake_case atau camelCase */}
                    {latestAddress.recipientName || latestAddress.recipient_name}
                    <span className="text-gray-500 ml-2 font-normal"> 
                        | {latestAddress.phoneNumber || latestAddress.phone_number}
                    </span>
                  </p>
                  <p>{latestAddress.fullAddress || latestAddress.full_address}</p>
                  
                  {latestAddress.notes && (
                    <p className="text-sm italic text-gray-500">"Catatan: {latestAddress.notes}"</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-900/50 rounded-md border border-dashed border-gray-600">
                  <p className="text-yellow-400 mb-3">⚠️ Anda belum mengatur alamat pengiriman</p>
                  <Link href="/checkout/alamat" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
                    Tambah Alamat Baru
                  </Link>
                </div>
              )}
            </div>

            {/* DETAIL BARANG */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-white text-xl font-bold mb-4">Detail Barang</h2>

              {items.map((item) => {
                // ✅ FIX: Gunakan casting (as any) untuk menghindari error TypeScript
                const itemPrice = item.price || (item as any).price_per_day || 0;
                
                return (
                  <div key={item.id} className="flex items-center gap-4 border-b border-gray-700 pb-4 last:border-none">
                    <div className="relative w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image || "/placeholder.png"} // Fallback Image
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-white font-semibold">{item.name}</p>
                      <div className="text-sm text-gray-400 flex gap-3 mt-1">
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">{item.duration} Hari</span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">x{item.quantity}</span>
                      </div>
                    </div>
                    <p className="text-teal-400 font-medium">
                      {formatCurrency(itemPrice * (item.duration || 1) * (item.quantity || 1))}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUMMARY PEMBAYARAN */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 sticky top-6">
            <h2 className="text-white text-xl font-bold mb-6">Rincian Pembayaran</h2>

            <div className="flex justify-between text-gray-300 mb-2">
              <span>Total Biaya Sewa</span>
              <span>{formatCurrency(totalBiayaSewa)}</span>
            </div>

            <div className="flex justify-between text-gray-300 mb-4">
              <span>Biaya Pengiriman</span>
              <span>{formatCurrency(biayaOngkir)}</span>
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            <div className="flex justify-between text-white text-xl font-bold mb-6">
              <span>Total Bayar</span>
              <span className="text-teal-400">{formatCurrency(totalPembayaran)}</span>
            </div>

            <button
              onClick={handleCreateOrder}
              // Disable jika loading, cart kosong, atau alamat belum ada
              disabled={loading || items.length === 0 || !latestAddress}
              className={`w-full py-3 font-bold rounded-lg transition ${
                loading || items.length === 0 || !latestAddress
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20"
              }`}
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
            
            {!latestAddress && (
                <p className="text-red-400 text-xs text-center mt-3">
                    *Mohon isi alamat pengiriman terlebih dahulu
                </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}