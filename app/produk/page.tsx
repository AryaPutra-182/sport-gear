// app/produk/page.tsx

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import ProductSearch from "@/app/components/ProductSearch";
import Link from "next/link";
import Image from "next/image";

// Halaman ini sekarang menerima 'searchParams' dari URL
export default async function ProdukPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchQuery = searchParams?.q || '';

  // --- LOGIKA PENGAMBILAN DATA BARU ---
  
  // 1. Ambil data kategori (tetap ditampilkan)
  const { data: categories } = await supabase.from('categories').select('*');

  // 2. Ambil data produk, tapi sekarang dengan filter pencarian
  let query = supabase.from('products').select('*');

  if (searchQuery) {
    // Jika ada query pencarian, tambahkan filter .ilike()
    // 'ilike' artinya case-insensitive (tidak peduli huruf besar/kecil)
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data: products, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching data:', error);
  }
  // --- AKHIR LOGIKA PENGAMBILAN DATA ---
  
  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Rent Instead Of Buying
          </h1>
          <ProductSearch />
        </div>
        
        {/* Jika ada query pencarian, tampilkan hasil. Jika tidak, tampilkan kategori. */}
        {searchQuery ? (
          <section>
            <h2 className="text-3xl font-bold text-white mb-10">
              Hasil Pencarian untuk: <span className="text-teal-400">{searchQuery}</span>
            </h2>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price_per_day={product.price_per_day}
                    image_url={product.image_url}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">Produk tidak ditemukan.</p>
            )}
          </section>
        ) : (
          <section>
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories?.map((category) => (
                <Link key={category.id} href={`/kategori/${category.name}`} className="group block relative overflow-hidden rounded-lg">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}