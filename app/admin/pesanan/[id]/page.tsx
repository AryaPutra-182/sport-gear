import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpdateStatusForm from "@/components/admin/UpdateStatusForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default async function AdminDetailPesananPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  // Query untuk mengambil semua detail terkait satu pesanan
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (*),
      addresses (*),
      order_items (
        quantity,
        duration,
        products (*)
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Detail Pesanan #{order.id}</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Info Pemesan & Alamat */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Informasi Pemesan</h2>
              {/* @ts-ignore */}
              <p className="text-gray-300"><strong>Nama:</strong> {order.profiles.full_name}</p>
              {/* @ts-ignore */}
              <p className="text-gray-300"><strong>Email:</strong> {order.profiles.email}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Alamat Pengiriman</h2>
              {/* @ts-ignore */}
              <p className="text-gray-300"><strong>Penerima:</strong> {order.addresses.recipient_name}</p>
              {/* @ts-ignore */}
              <p className="text-gray-300"><strong>Telepon:</strong> {order.addresses.phone_number}</p>
              {/* @ts-ignore */}
              <p className="text-gray-300"><strong>Alamat:</strong> {order.addresses.full_address}</p>
            </div>
          </div>
          
          {/* Kolom Kanan: Detail Barang & Status */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Barang yang Disewa</h2>
            <div className="space-y-4 mb-6">
              {/* @ts-ignore */}
              {order.order_items.map(item => (
                <div key={item.products.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-4">
                    <Image src={item.products.image_url} alt={item.products.name} width={50} height={50} className="rounded-md" />
                    <div>
                      <p className="text-white">{item.products.name}</p>
                      <p className="text-sm text-gray-400">{item.quantity} unit x {item.duration} hari</p>
                    </div>
                  </div>
                  <p className="text-white">{formatCurrency(item.products.price_per_day * item.quantity * item.duration)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total Pesanan:</span>
                <span>{formatCurrency(order.total_price)}</span>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-6">
              <h2 className="text-xl font-bold text-white mb-2">Status Pesanan</h2>
              <p className="text-lg capitalize text-yellow-400 mb-4">{order.status?.replace('_', ' ')}</p>
              <UpdateStatusForm orderId={order.id} currentStatus={order.status || ''} />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}