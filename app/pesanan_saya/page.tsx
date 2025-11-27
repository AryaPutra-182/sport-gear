"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchOrders } from "@/lib/api"; 

// Interface Types
interface ProductInfo {
  id: number;
  name: string;
  imageUrl?: string; 
  image_url?: string;
}

interface OrderItem {
  quantity: number;
  product?: ProductInfo;
}

interface Order {
  id: number;
  createdAt: string;
  totalPrice: number;
  status: string;
  items: OrderItem[];
}

export default function PesananSayaPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai": return "bg-green-100 text-green-800 border border-green-200";
      case "batal": return "bg-red-100 text-red-800 border border-red-200";
      case "paid": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "dikemas": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "dikirim": return "bg-purple-100 text-purple-800 border border-purple-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchOrders();

        if (res.error === "Unauthorized" || res.status === 401) {
          router.push("/login?redirect_to=/pesanan_saya");
          return;
        }

        if (res.error) {
          console.error("Error API:", res.error);
        } else {
          const data = Array.isArray(res) ? res : (res.data || []);
          setOrders(data);
        }
      } catch (e) {
        console.error("Gagal mengambil pesanan:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-[#122D4F] text-center mb-10">
          Riwayat Pesanan
        </h1>

        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#122D4F] mx-auto"></div>
             <p className="text-gray-500 mt-4 font-medium">Memuat riwayat pesanan...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              // ✅ Card Putih dengan Shadow
              <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 transition hover:shadow-lg">
                
                {/* Header Card Pesanan */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#122D4F]">Pesanan #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${getStatusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </span>
                    <p className="text-lg font-bold text-[#122D4F] mt-1 sm:mt-2">{formatCurrency(order.totalPrice)}</p>
                  </div>
                </div>

               {/* List Items */}
                <div className="space-y-4 mb-4">
                  {order.items.length > 0 ? (
                    order.items.map((item, i) => {
                      const productName = item.product?.name || "Produk tidak tersedia";
                      const productImg = item.product?.imageUrl || item.product?.image_url || "/placeholder.png";

                      return (
                        <div key={i} className="flex items-center gap-4 bg-[#F9FAFB] p-3 rounded-lg border border-gray-100">
                          {/* Gambar Produk */}
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-white">
                             <Image
                                src={productImg}
                                alt={productName}
                                fill
                                className="object-cover"
                                sizes="100px"
                             />
                          </div>
                          {/* Detail Text */}
                          <div>
                            <p className="text-[#122D4F] font-bold text-base">{productName}</p>
                            <p className="text-gray-500 text-sm mt-1 font-medium">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // ✅ TAMBAHAN: Tampilan jika items kosong (Order #2 akan masuk sini)
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                        <p className="text-red-500 text-sm italic">
                            ⚠️ Data barang untuk pesanan ini tidak ditemukan.
                        </p>
                    </div>
                  )}
                </div>
                {/* Action Buttons (Tanpa Tombol Pengembalian) */}
                <div className="flex justify-end gap-3 items-center pt-4 border-t border-gray-100">
                  <Link 
                    href={`/status-pesanan/${order.id}`} 
                    className="text-[#122D4F] font-medium text-sm hover:text-[#F4B400] transition-colors flex items-center gap-1 mr-auto sm:mr-0"
                  >
                    Lacak Pesanan &rarr;
                  </Link>

                  {/* Tombol Ulasan (Hanya jika Selesai & Produk Ada) */}
                  {order.status === "selesai" && order.items[0]?.product?.id && (
                    <Link
                      href={`/ulasan/${order.items[0].product.id}`}
                      className="bg-[#122D4F] hover:bg-[#0C2E4E] text-white text-sm font-bold py-2 px-5 rounded-lg transition shadow-md"
                    >
                      Beri Ulasan
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Tampilan Kosong
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto shadow-sm">
            <h2 className="text-xl font-bold text-[#122D4F] mb-2">Belum ada pesanan</h2>
            <p className="text-gray-500 mb-6">Anda belum menyewa barang apapun.</p>
            <Link href="/produk" className="inline-block bg-[#F4B400] hover:bg-[#e0a500] text-[#122D4F] font-bold py-3 px-8 rounded-full transition shadow-md hover:shadow-lg">
               Mulai Belanja
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}