import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";

// Konfigurasi URL Backend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// --- 1. Helper Format Uang ---
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// --- 2. Helper Label Status (Updated Colors for Light Theme) ---
const getStatusBadge = (status: string) => {
  const styles: any = {
    unpaid: "bg-red-100 text-red-700 border border-red-200",
    paid: "bg-blue-100 text-blue-700 border border-blue-200",
    dikemas: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    dikirim: "bg-purple-100 text-purple-700 border border-purple-200",
    selesai: "bg-green-100 text-green-700 border border-green-200",
    batal: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  
  const labels: any = {
    unpaid: "Belum Bayar",
    paid: "Sudah Bayar",
    dikemas: "Sedang Dikemas",
    dikirim: "Sedang Dikirim",
    selesai: "Selesai",
    batal: "Dibatalkan",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status] || "bg-gray-100"}`}>
      {labels[status] || status}
    </span>
  );
};

// --- 3. Validasi Admin (Server Side) ---
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

    if (!user || user.role !== "admin") {
        redirect("/");
    }

    return token;
  } catch (error) {
    redirect("/login");
  }
}

// --- 4. Fetch ALL Orders (Admin Endpoint) ---
async function getAllOrders(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
}

export default async function AdminPesananPage() {
  const token = await validateAdmin();
  const orders = await getAllOrders(token);

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-extrabold text-[#122D4F]">Manajemen Pesanan</h1>
                <p className="text-gray-600 mt-1">Pantau semua transaksi sewa yang masuk.</p>
            </div>
            <div className="bg-white px-5 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-[#122D4F] font-bold text-sm">Total Pesanan: {orders.length}</span>
            </div>
        </div>

        {/* Table Container (Putih + Shadow) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#122D4F] text-white uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID Pesanan</th>
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {orders.length > 0 ? (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-[#F7F5E9] transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-[#122D4F]">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#122D4F]">{order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#F4B400]">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                            href={`/admin/pesanan/${order.id}`} 
                            className="inline-flex items-center gap-2 bg-[#122D4F] hover:bg-[#0C2E4E] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 italic bg-gray-50">
                        Belum ada pesanan masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}