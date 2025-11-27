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

// Helper Status Color (Light Theme)
const getStatusBadgeClass = (status: string) => {
    const map: any = {
        unpaid: "bg-red-100 text-red-700 border-red-200",
        paid: "bg-blue-100 text-blue-700 border-blue-200",
        dikemas: "bg-yellow-100 text-yellow-700 border-yellow-200",
        dikirim: "bg-purple-100 text-purple-700 border-purple-200",
        selesai: "bg-green-100 text-green-700 border-green-200",
        batal: "bg-gray-200 text-gray-600 border-gray-300",
    };
    return map[status] || "bg-gray-100 text-gray-600";
};

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
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-[#122D4F]">
                    Detail Pesanan #{order.id}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Lihat dan kelola status pesanan pelanggan.</p>
            </div>
            <a 
                href="/admin/pesanan" 
                className="text-[#122D4F] hover:text-[#F4B400] text-sm font-bold underline transition-colors"
            >
                &larr; Kembali ke Daftar
            </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Kiri: User + Alamat */}
          <div className="space-y-6">

            {/* Card Informasi Pemesan */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg text-[#122D4F] font-bold mb-4 border-b border-gray-100 pb-2">
                Informasi Pemesan
              </h2>
              <div className="text-gray-600 space-y-3 text-sm">
                  <p><span className="font-semibold text-[#122D4F]">Nama:</span> {order.user?.name || "N/A"}</p>
                  <p><span className="font-semibold text-[#122D4F]">Email:</span> {order.user?.email || "N/A"}</p>
                  <p><span className="font-semibold text-[#122D4F]">Tanggal:</span> {new Date(order.createdAt).toLocaleDateString("id-ID", { dateStyle: 'full' })}</p>
              </div>
            </div>

            {/* Card Alamat */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg text-[#122D4F] font-bold mb-4 border-b border-gray-100 pb-2">
                Alamat Pengiriman
              </h2>
              {order.address ? (
                  <div className="text-gray-600 space-y-1 text-sm">
                    <p className="font-bold text-[#122D4F] text-base">{order.address.recipientName}</p>
                    <p className="text-[#F4B400] font-medium">{order.address.phoneNumber}</p>
                    <div className="mt-2">
                        <p>{order.address.fullAddress}</p>
                        <p>{order.address.city} {order.address.postalCode}</p>
                    </div>
                    {order.address.notes && (
                        <div className="mt-3 p-2 bg-[#F7F5E9] rounded border border-gray-200">
                            <p className="italic text-xs text-gray-500">"Catatan: {order.address.notes}"</p>
                        </div>
                    )}
                  </div>
              ) : (
                  <p className="text-red-500 italic bg-red-50 p-3 rounded">Data alamat tidak ditemukan.</p>
              )}
            </div>

          </div>

          {/* Kanan: Products + Status */}
          <div className="bg-white rounded-xl p-8 lg:col-span-2 border border-gray-200 shadow-lg">

            <h2 className="text-xl text-[#122D4F] font-bold mb-6 border-b border-gray-100 pb-4">
                Barang yang Disewa
            </h2>

            <div className="space-y-6 mb-8">
              {order.items?.map((item: any) => {
                const productName = item.product?.name || "Produk dihapus";
                const productImg = item.product?.imageUrl || item.product?.image_url || "/placeholder.png";
                const price = item.priceAtOrder || item.product?.pricePerDay || 0;
                const subtotal = price * item.quantity * item.duration;

                return (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-none">
                    <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <Image 
                                src={productImg} 
                                alt={productName} 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                        <div>
                        <p className="text-[#122D4F] font-bold text-lg">{productName}</p>
                        <div className="flex gap-3 mt-1">
                            <span className="text-xs bg-[#F7F5E9] text-[#122D4F] px-2 py-1 rounded border border-gray-200">
                                {item.quantity} unit
                            </span>
                            <span className="text-xs bg-[#F7F5E9] text-[#122D4F] px-2 py-1 rounded border border-gray-200">
                                {item.duration} hari
                            </span>
                        </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[#122D4F] font-bold text-lg">
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

            <div className="bg-[#F7F5E9] p-6 rounded-xl border border-[#122D4F]/10">
                <div className="flex justify-between text-xl text-[#122D4F] font-extrabold mb-6">
                    <span>Total Pesanan:</span>
                    <span className="text-[#F4B400]">{formatCurrency(order.totalPrice)}</span>
                </div>

                <div className="border-t border-gray-300 my-4 pt-4">
                    <h2 className="text-lg text-[#122D4F] font-bold mb-3">Update Status</h2>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <span className="text-gray-600 text-sm font-medium">Status Saat Ini:</span>
                        <span className={`px-3 py-1 rounded border text-sm font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                            {order.status.replace("_", " ")}
                        </span>
                    </div>

                    {/* Komponen Update Status */}
                    <UpdateStatusForm orderId={order.id} currentStatus={order.status} />
                </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}