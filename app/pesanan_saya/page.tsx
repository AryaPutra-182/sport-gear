import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import ReturnItemButton from "@/components/ReturnItemButton"; // 1. Impor komponen baru

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default async function PesananSayaPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect_to=/pesanan_saya');
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      total_price,
      status,
      order_items (
        quantity,
        products (
          id,
          name,
          image_url
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching orders:", error);
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Pesanan Saya
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {orders && orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Pesanan #{order.id}</p>
                    <p className="text-sm text-gray-400">Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{formatCurrency(order.total_price)}</p>
                    <p className="text-right text-sm capitalize text-yellow-400">{order.status?.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Image src={item.products?.image_url ?? ''} alt={item.products?.name ?? 'Produk'} width={64} height={64} className="rounded-md object-cover" />
                      <div>
                        <p className="font-semibold text-white">{item.products?.name}</p>
                        <p className="text-sm text-gray-400">Jumlah: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Logika untuk menampilkan tombol aksi */}
                <div className="mt-6 flex justify-end items-center gap-4">
                  <Link href={`/status-pesanan/${order.id}`} className="font-medium text-blue-500 hover:underline">
                      Lacak Pesanan
                  </Link>
                  {order.status === 'selesai' && (
                    <>
                      {/* Ambil product id dari item pertama untuk link ulasan */}
                      <Link href={`/ulasan/${order.order_items[0]?.products?.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                        Beri Ulasan
                      </Link>
                      <ReturnItemButton orderId={order.id} />
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-300">Anda belum memiliki riwayat pesanan.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}