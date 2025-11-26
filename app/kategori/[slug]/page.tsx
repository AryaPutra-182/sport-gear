// app/kategori/[slug]/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/api";

// Definisikan tipe data Produk
interface Product {
  id: number;
  name: string;
  price_per_day: number;
  imageUrl?: string; // CamelCase (Backend Baru)
  image_url?: string; // SnakeCase (Backend Lama - Jaga-jaga)
}

export default async function KategoriProdukPage({
  params,
}: {
  params: { slug: string };
}) {
  // 1. Decode URL (misal: "Sepatu%20Lari" jadi "Sepatu Lari")
  const categoryName = decodeURIComponent(params.slug);

  // 2. Fetch Data di Server (Langsung panggil API)
  let products: Product[] = [];
  
  try {
    const res = await getProductsByCategory(categoryName);
    // Handle struktur response backend: res.data (array) atau res (array)
    products = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
  } catch (error) {
    console.error("Error fetching category products:", error);
    products = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Header Kategori */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">
            Kategori: <span className="text-teal-400 capitalize">{categoryName}</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Menampilkan alat olahraga untuk kategori ini
          </p>
        </div>

        {/* Grid Produk */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price_per_day={product.price_per_day}
                // ✅ PENTING: Handle imageUrl (CamelCase) dan Fallback
                image_url={product.imageUrl || product.image_url || "/placeholder.png"}
              />
            ))}
          </div>
        ) : (
          // Tampilan Jika Kosong
          <div className="text-center py-20 bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">
              Produk Tidak Ditemukan
            </h2>
            <p className="text-gray-400 mb-6">
              Belum ada produk untuk kategori "{categoryName}".
            </p>
            <Link
              href="/produk"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full transition"
            >
              Lihat Semua Produk
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}