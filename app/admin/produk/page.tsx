import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeleteProductButton from "@/components/admin/DeleteProductButton"; // 1. Impor komponen baru
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

async function checkAdminRole() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect_to=/admin/produk');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default async function AdminProdukPage() {
  await checkAdminRole();
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  // 2. Pastikan kita mengambil 'image_url' untuk diteruskan ke tombol hapus
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price_per_day,
      image_url, 
      categories ( name )
    `)
    .order('created_at', { ascending: false });

  if (error) console.error("Error fetching products for admin:", error);

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Manajemen Produk</h1>
            <Link href="/admin/produk/tambah" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
              + Tambah Produk Baru
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Nama Produk</th>
                  <th scope="col" className="px-6 py-3">Kategori</th>
                  <th scope="col" className="px-6 py-3">Harga / Hari</th>
                  <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map(product => (
                    <tr key={product.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4">
                        {/* @ts-ignore */}
                        {product.categories?.name ?? 'Tanpa Kategori'}
                      </td>
                      <td className="px-6 py-4">{formatCurrency(product.price_per_day)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/produk/edit/${product.id}`} className="font-medium text-blue-500 hover:underline mr-4">Edit</Link>
                        {/* 3. Ganti tombol lama dengan komponen baru */}
                        <DeleteProductButton productId={product.id} imageUrl={product.image_url} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-6 py-4 text-center">Belum ada produk.</td></tr>
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
