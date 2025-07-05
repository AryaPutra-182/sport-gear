import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductForm from "@/components/admin/ProductForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

// Fungsi untuk mengambil data kategori
async function getCategories() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('categories').select('id, name');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export default async function TambahProdukPage() {
  // Ambil data kategori di sisi server
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Tambah Produk Baru
          </h1>
          {/* Render komponen form dan oper data kategori */}
          <ProductForm categories={categories} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
