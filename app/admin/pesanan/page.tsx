import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

// Konfigurasi URL Backend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// --- 1. Helper Format Uang ---
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// --- 2. Helper Label Status (Dengan Warna) ---
const getStatusBadge = (status: string) => {
  const styles: any = {
    unpaid: "bg-red-900 text-red-200",
    paid: "bg-blue-900 text-blue-200",
    dikemas: "bg-yellow-900 text-yellow-200",
    dikirim: "bg-purple-900 text-purple-200",
    selesai: "bg-green-900 text-green-200",
    batal: "bg-gray-700 text-gray-400",
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
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-700"}`}>
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
    // Perhatikan: Endpointnya "/orders" (bukan /orders/mine)
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", // Pastikan data selalu fresh
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
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-xl">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-3xl font-bold text-white">Manajemen Pesanan</h1>
             <span className="text-gray-400 text-sm">Total: {orders.length} Pesanan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-300">
              <thead className="text-xs uppercase bg-gray-900 text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Pemesan</th>
                  <th className="px-6 py-4 text-left">Tanggal</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.length > 0 ? (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 font-mono text-teal-400">#{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                            href={`/admin/pesanan/${order.id}`} 
                            className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                        >
                          Detail / Proses
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
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