import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/ProductSearch";
import Link from "next/link";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type Category = {
  id: number;
  name: string;
  imageUrl?: string;
  image_url?: string;
};

type Product = {
  id: number;
  name: string;
  price_per_day: number;
  imageUrl?: string;
  image_url?: string;
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`, { cache: "no-store" });
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
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
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-[#122D4F] mb-6">
            Rent Instead Of Buying
          </h1>
          <ProductSearch />
        </div>

        {/* HASIL PENCARIAN */}
        {searchQuery ? (
          <>
            <h2 className="text-3xl font-bold text-[#122D4F] mb-8">
              Hasil untuk: <span className="font-normal">{searchQuery}</span>
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product: any) => ( // Gunakan 'any' sementara untuk aman
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    // ✅ PERBAIKAN: Ambil pricePerDay jika ada, fallback ke price_per_day
                    price_per_day={product.pricePerDay || product.price_per_day || 0}
                    image_url={product.imageUrl || product.image_url || "/placeholder.png"}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Produk tidak ditemukan.</p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-center text-sm font-bold text-[#122D4F] tracking-widest mb-6">
              POPULAR CATEGORIES
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${encodeURIComponent(category.name)}`}
                  className="group block relative overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-52">
                    <Image
                      src={category.imageUrl || category.image_url || "/placeholder-category.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-[#122D4F]">
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