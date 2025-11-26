import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpdateStatusForm from "@/components/admin/UpdateStatusForm";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Format uang Rupiah
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// --- 1. Validasi Admin & Ambil Token ---
async function validateAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/login?redirect_to=/admin/pesanan");

  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();
    const user = json.data || json;

    if (!user || user.role !== "admin") redirect("/");
    return token;
  } catch (error) {
    redirect("/login");
  }
}

// --- 2. Fetch Order Detail (Server Side) ---
async function getOrderById(id: string, token: string) {
  try {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    
    const json = await res.json();
    return json.data || json; // Handle struktur response
  } catch (error) {
    return null;
  }
}

export default async function AdminDetailPesananPage({ params }: { params: { id: string } }) {
  const token = await validateAdmin();
  const order = await getOrderById(params.id, token);

  if (!order || !order.id) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">

        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
            Detail Pesanan #{order.id}
            </h1>
            <a href="/admin/pesanan" className="text-gray-400 hover:text-white text-sm underline">
                &larr; Kembali
            </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Kiri: User + Alamat */}
          <div className="space-y-6">

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl text-teal-400 font-bold mb-4">Informasi Pemesan</h2>
              <div className="text-gray-300 space-y-2">
                  <p><strong>Nama:</strong> {order.user?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                  <p><strong>Tanggal Order:</strong> {new Date(order.createdAt).toLocaleDateString("id-ID", { dateStyle: 'full' })}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl text-teal-400 font-bold mb-4">Alamat Pengiriman</h2>
              {order.address ? (
                  <div className="text-gray-300 space-y-1">
                    <p className="font-bold text-white">{order.address.recipientName}</p>
                    <p>{order.address.phoneNumber}</p>
                    <p>{order.address.fullAddress}</p>
                    <p>{order.address.city} {order.address.postalCode}</p>
                    {order.address.notes && <p className="italic text-sm text-gray-500 mt-2">"{order.address.notes}"</p>}
                  </div>
              ) : (
                  <p className="text-red-400">Data alamat tidak ditemukan.</p>
              )}
            </div>

          </div>

          {/* Kanan: Products + Status */}
          <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2 border border-gray-700">

            <h2 className="text-xl text-teal-400 font-bold mb-4">Barang yang Disewa</h2>

            <div className="space-y-4 mb-6">
              {order.items?.map((item: any) => {
                // Handle kemungkinan nama field berbeda (snake_case vs camelCase)
                const productName = item.product?.name || "Produk dihapus";
                const productImg = item.product?.imageUrl || item.product?.image_url || "/placeholder.png";
                const price = item.priceAtOrder || item.product?.pricePerDay || 0;
                const subtotal = price * item.quantity * item.duration;

                return (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-none">
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                                src={productImg} 
                                alt={productName} 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                        <div>
                        <p className="text-white font-semibold">{productName}</p>
                        <p className="text-sm text-gray-400">
                            {item.quantity} unit × {item.duration} hari
                        </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-medium">
                            {formatCurrency(subtotal)}
                        </p>
                        <p className="text-xs text-gray-500">
                            (@ {formatCurrency(price)}/hari)
                        </p>
                    </div>
                    </div>
                );
              })}
            </div>

            <div className="border-t border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-lg text-white font-bold">
                <span>Total Pesanan:</span>
                <span className="text-teal-400">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h2 className="text-lg text-white font-bold mb-2">Update Status Pesanan</h2>
              <div className="flex items-center gap-4 mb-4">
                  <span className="text-gray-400 text-sm">Status Saat Ini:</span>
                  <span className={`px-3 py-1 rounded text-sm font-bold uppercase tracking-wider
                    ${order.status === 'unpaid' ? 'bg-red-900 text-red-200' : 
                      order.status === 'selesai' ? 'bg-green-900 text-green-200' : 
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                    {order.status.replace("_", " ")}
                  </span>
              </div>

              {/* Komponen Update Status */}
              <UpdateStatusForm orderId={order.id} currentStatus={order.status} />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}