// app/produk/page.tsx

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { supabase } from "@/lib/supabaseClient";

export default async function ProdukPage() {
  
  // Mengambil semua data dari tabel 'products'
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false }); // Mengurutkan dari yang terbaru

  if (error) {
    console.error('Error fetching products:', error);
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Semua Produk
        </h1>

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
          <p className="text-center text-gray-400">
            Saat ini belum ada produk yang tersedia.
          </p>
        )}
      </main>

      <Footer />
    </div>
  )
}