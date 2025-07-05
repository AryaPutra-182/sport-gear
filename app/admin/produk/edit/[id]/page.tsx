import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductForm from "@/components/admin/ProductForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// Fungsi untuk mengambil data kategori
async function getCategories(supabase: any) {
  const { data, error } = await supabase.from('categories').select('id, name');
  if (error) return [];
  return data;
}

// Fungsi untuk mengambil data produk spesifik
async function getProduct(supabase: any, id: string) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) notFound();
  return data;
}

export default async function EditProdukPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  
  // Ambil data produk dan kategori secara bersamaan
  const [product, categories] = await Promise.all([
    getProduct(supabase, params.id),
    getCategories(supabase)
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Edit Produk
          </h1>
          {/* Render komponen form dan oper data produk dan kategori */}
          <ProductForm categories={categories} initialData={product} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
