// app/kategori/[slug]/page.tsx

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export default async function KategoriProdukPage({ params }: { params: { slug: string } }) {
  const categoryName = decodeURI(params.slug);

  // Query yang sudah diperbaiki
  const { data: products, error } = await supabase
    .from('products')
    .select(`*, categories!inner(name)`) // <-- PERUBAHAN DI SINI
    .eq('categories.name', categoryName);

  if (error || !products || products.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Produk Kategori: <span className="text-teal-400">{categoryName}</span>
        </h1>

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
      </main>

      <Footer />
    </div>
  )
}