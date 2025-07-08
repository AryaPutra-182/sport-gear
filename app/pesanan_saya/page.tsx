import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import ReturnItemButton from "@/components/ReturnItemButton";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mendefinisikan tipe data untuk membantu TypeScript
type ProductInfo = {
  id: number;
  name: string;
  image_url: string;
};

type OrderItem = {
  quantity: number;
  products: ProductInfo | null; // Supabase seharusnya mengembalikan objek, bukan array
};

type Order = {
  id: number;
  created_at: string;
  total_price: number;
  status: string | null;
  order_items: OrderItem[];
};


export default async function PesananSayaPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect_to=/pesanan_saya');
  }

  const { data, error } = await supabase
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

  const orders: Order[] = (data || []).map((order: any) => ({
    ...order,
    order_items: (order.order_items || []).map((item: any) => ({
      ...item,
      products: Array.isArray(item.products) ? item.products[0] ?? null : item.products ?? null,
    })),
  }));
  
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
                  {order.order_items.map((item, index) => {
                    // Mengambil data produk dari item
                    const product = item.products;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <Image 
                          src={product?.image_url || `https://placehold.co/64x64/2d3748/e2e8f0?text=No+Img`}
                          alt={product?.name ?? 'Gambar Produk'} 
                          width={64} 
                          height={64} 
                          className="rounded-md object-cover bg-gray-700" 
                        />
                        <div>
                          <p className="font-semibold text-white">{product?.name ?? 'Produk Dihapus'}</p>
                          <p className="text-sm text-gray-400">Jumlah: {item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 flex justify-end items-center gap-4">
                  <Link href={`/status-pesanan/${order.id}`} className="font-medium text-blue-500 hover:underline">
                      Lacak Pesanan
                  </Link>
                  {order.status === 'selesai' && (
                    <>
                      {/* @ts-ignore */}
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