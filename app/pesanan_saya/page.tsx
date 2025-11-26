"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReturnItemButton from "@/components/ReturnItemButton";
import { fetchOrders } from "@/lib/api"; 

// Interface Types (Sesuaikan dengan respon Backend)
interface ProductInfo {
  id: number;
  name: string;
  imageUrl?: string; // CamelCase (Backend Baru)
  image_url?: string; // SnakeCase (Legacy)
}

interface OrderItem {
  quantity: number;
  product?: ProductInfo; // Bisa undefined jika produk dihapus
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
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-10">Pesanan Saya</h1>

        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
             <p className="text-gray-400 mt-4">Memuat riwayat pesanan...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                
                {/* Header Card Pesanan */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Pesanan #{order.id}</p>
                    <p className="text-sm text-gray-400">
                      Tanggal: {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatCurrency(order.totalPrice)}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded capitalize 
                      ${order.status === 'selesai' ? 'bg-green-500/20 text-green-400' : 
                        order.status === 'batal' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* List Items */}
                <div className="space-y-4">
                  {order.items.map((item, i) => {
                    // Handle jika produk dihapus atau null
                    const product = item.product || { name: "Produk tidak tersedia", imageUrl: null, image_url: null, id: 0 };
                    const imgUrl = product.imageUrl || product.image_url || "/placeholder.png";

                    return (
                      <div key={i} className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-md">
                        <div className="relative w-16 h-16 flex-shrink-0">
                           <Image
                              src={imgUrl}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                           />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{product.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-4 items-center">
                  <Link href={`/status-pesanan/${order.id}`} className="text-teal-400 hover:text-teal-300 text-sm font-medium hover:underline">
                    Lacak Pesanan
                  </Link>

                  {order.status === "selesai" && order.items[0]?.product && (
                    <>
                      <Link
                        href={`/ulasan/${order.items[0].product.id}`}
                        className="bg-gray-700 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition"
                      >
                        Beri Ulasan
                      </Link>
                      <ReturnItemButton orderId={order.id} />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700 max-w-2xl mx-auto">
            <p className="text-gray-300 text-lg mb-4">Anda belum memiliki riwayat pesanan.</p>
            <Link href="/produk" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full transition">
               Mulai Belanja
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}