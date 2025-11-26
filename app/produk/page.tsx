// app/produk/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/ProductSearch";
import Link from "next/link";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// ✅ UPDATE 1: Sesuaikan tipe data dengan Backend (imageUrl)
type Category = {
  id: number;
  name: string;
  imageUrl?: string; // Gunakan imageUrl (CamelCase)
  image_url?: string; // Jaga-jaga jika backend masih kirim snake_case
};

type Product = {
  id: number;
  name: string;
  price_per_day: number;
  imageUrl?: string; // Gunakan imageUrl
  image_url?: string;
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`, { cache: "no-store" });
    const json = await res.json();
    // Pastikan mengambil dari json.data
    return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    return [];
  }
}

async function getProducts(query: string): Promise<Product[]> {
  try {
    const url = query
      ? `${BASE_URL}/products?q=${encodeURIComponent(query)}`
      : `${BASE_URL}/products`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    // Pastikan mengambil dari json.data
    return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return [];
  }
}

export default async function ProdukPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchQuery = searchParams?.q || "";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(searchQuery),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Rent Instead Of Buying
          </h1>
          <ProductSearch />
        </div>

        {/* Jika ada search query tampilkan hasil pencarian */}
        {searchQuery ? (
          <>
            <h2 className="text-3xl font-bold text-white mb-10">
              Hasil Pencarian:{" "}
              <span className="text-teal-400">{searchQuery}</span>
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price_per_day={product.price_per_day}
                    // ✅ UPDATE 2: Kirim prop imageUrl yang benar (Support kedua format)
                    image_url={product.imageUrl || product.image_url || "/placeholder.png"}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Produk tidak ditemukan.
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Popular Categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${encodeURIComponent(category.name)}`}
                  className="group block relative overflow-hidden rounded-lg aspect-square"
                >
                  {/* ✅ UPDATE 3: Panggil category.imageUrl */}
                  <Image
                    src={category.imageUrl || category.image_url || "/placeholder-category.jpg"}
                    alt={category.name}
                    width={400}
                    height={400}
                    priority
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                    <h3 className="text-white text-2xl font-bold uppercase tracking-wider">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}