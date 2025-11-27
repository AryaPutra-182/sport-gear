import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/ProductSearch";
import Link from "next/link";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Tipe data
type Category = {
  id: number;
  name: string;
  imageUrl?: string;
  image_url?: string;
};

type Product = {
  id: number;
  name: string;
  pricePerDay?: number;
  price_per_day?: number;
  imageUrl?: string;
  image_url?: string;
};

// Fetch Categories
async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`, { cache: "no-store" });
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

// Fetch Products
async function getProducts(query: string): Promise<Product[]> {
  try {
    const url = query
      ? `${BASE_URL}/products?q=${encodeURIComponent(query)}`
      : `${BASE_URL}/products`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function ProdukPage({ searchParams }: { searchParams?: { q?: string } }) {
  const searchQuery = searchParams?.q || "";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(searchQuery),
  ]);

  return (
    // ✅ Background Cream sesuai gambar
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* --- HEADER & SEARCH --- */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-[#122D4F] mb-6 tracking-tight">
            Rent Instead Of <br /> Buying
          </h1>
          
          {/* Container Search agar rapi di tengah */}
          <div className="max-w-2xl mx-auto relative z-10">
             <ProductSearch />
          </div>
        </div>

        {/* --- HASIL PENCARIAN (Jika ada search) --- */}
        {searchQuery ? (
          <>
            <h2 className="text-3xl font-bold text-[#122D4F] mb-8 border-b-2 border-[#122D4F]/10 pb-2 inline-block">
              Hasil untuk: <span className="text-[#F4B400]">{searchQuery}</span>
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    // Mapping harga & gambar aman
                    price_per_day={product.pricePerDay || product.price_per_day || 0}
                    image_url={product.imageUrl || product.image_url || "/placeholder.png"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                 <p className="text-gray-500 text-lg">Produk tidak ditemukan.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* --- POPULAR CATEGORIES (BENTO GRID LAYOUT) --- */}
            <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-white bg-[#122D4F] py-2 px-6 rounded-full inline-block tracking-widest uppercase shadow-md">
                POPULAR CATEGORIES
                </h2>
            </div>

            {/* Layout Grid Unik (1 Besar di Kiri, 4 Kecil di Kanan) */}
            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
              {categories.map((category, index) => {
                // Logika: Item pertama jadi besar (Span 2 kolom & 2 baris)
                const isLarge = index === 0;
                
                return (
                  <Link
                    key={category.id}
                    href={`/kategori/${encodeURIComponent(category.name)}`}
                    className={`group relative overflow-hidden rounded-2xl shadow-md border border-white/20 hover:shadow-xl transition-all duration-300 ${
                      isLarge ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
                    }`}
                  >
                    {/* Gambar Full Cover */}
                    <Image
                      src={category.imageUrl || category.image_url || "/placeholder-category.jpg"}
                      alt={category.name}
                      fill
                      sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay Gradient Gelap (Supaya teks terbaca) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#122D4F]/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Teks Kategori di Pojok Bawah */}
                    <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                      <h3 className={`font-bold text-white leading-tight ${isLarge ? "text-3xl" : "text-lg"}`}>
                        {category.name}
                      </h3>
                      {isLarge && (
                        <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                           Jelajahi koleksi &rarr;
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}