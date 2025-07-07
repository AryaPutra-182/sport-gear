import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

// Fungsi keamanan untuk memeriksa peran admin
async function checkAdminRole() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect_to=/admin/pesanan');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');
}

// Fungsi untuk format harga
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
};

// Fungsi baru untuk menerjemahkan status
const getStatusLabel = (status: string | null): string => {
  switch (status) {
    case 'unpaid': return 'Unpaid';
    case 'paid': return 'Paid';
    case 'dikemas': return 'Dikemas';
    case 'dikirim': return 'Dikirim';
    case 'selesai': return 'Selesai';
    default: return status || 'Unknown';
  }
}

export default async function AdminPesananPage() {
  await checkAdminRole();

  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`id, created_at, total_price, status, profiles:user_id (full_name, email)`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders for admin:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Manajemen Pesanan
            </h1>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">ID Pesanan</th>
                  <th scope="col" className="px-6 py-3">Pemesan</th>
                  <th scope="col" className="px-6 py-3">Tanggal</th>
                  <th scope="col" className="px-6 py-3">Total</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map(order => (
                    <tr key={order.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                      <td className="px-6 py-4">
                        {/* @ts-ignore */}
                        {order.profiles?.full_name || order.profiles?.email}
                      </td>
                      <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4">{formatCurrency(order.total_price)}</td>
                      <td className="px-6 py-4 capitalize">{getStatusLabel(order.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/pesanan/${order.id}`} className="font-medium text-blue-500 hover:underline">Detail</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">Belum ada pesanan yang masuk.</td>
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