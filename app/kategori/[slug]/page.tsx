// app/kategori/[slug]/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/api";

// ✅ 1. Update Interface (Support CamelCase dari Backend)
interface Product {
  id: number;
  name: string;
  pricePerDay?: number;  // Backend Prisma
  price_per_day?: number; // Legacy
  imageUrl?: string;
  image_url?: string;
}

export default async function KategoriProdukPage({
  params,
}: {
  params: { slug: string };
}) {
  // Decode URL (misal: "Sepatu%20Lari" jadi "Sepatu Lari")
  const categoryName = decodeURIComponent(params.slug);

  let products: Product[] = [];
  
  try {
    const res = await getProductsByCategory(categoryName);
    products = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
  } catch (error) {
    console.error("Error fetching category products:", error);
    products = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Header Kategori */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#122D4F]">
            Kategori: <span className="text-[#F4B400] capitalize">{categoryName}</span>
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
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
                // ✅ 2. Fix Price & Image Mapping (Anti NaN & Broken Image)
                price_per_day={product.pricePerDay || product.price_per_day || 0}
                image_url={product.imageUrl || product.image_url || "/placeholder.png"}
              />
            ))}
          </div>
        ) : (
          // Tampilan Jika Kosong (Updated Style)
          <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-[#122D4F] mb-2">
              Produk Tidak Ditemukan
            </h2>
            <p className="text-gray-500 mb-6">
              Belum ada produk untuk kategori "{categoryName}".
            </p>
            <Link
              href="/produk"
              className="bg-[#122D4F] hover:bg-[#0C2E4E] text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
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