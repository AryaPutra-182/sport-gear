"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductInteraction from "@/components/ProductInteraction";
import ReviewSection from "@/components/ReviewSection";
import { getProductDetail } from "@/lib/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function DetailProdukPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const res = await getProductDetail(id as string);

        if (!res || res.error || res.status === 404) {
          console.error("Produk tidak ditemukan:", res?.error);
          router.push("/404"); 
          return;
        }

        const productData = res.data || res;
        setProduct(productData);
        console.log("🔥 PRODUCT DATA:", productData);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  // --- LOADING STATE (Tema Cream) ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5E9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#122D4F]"></div>
      </div>
    );
  }

  // --- NOT FOUND STATE (Tema Cream) ---
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5E9] text-[#122D4F] font-bold">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    // ✅ Background Cream (#F7F5E9)
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">

          {/* Bagian Gambar (Card Putih dengan Shadow) */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200">
            <Image 
              src={product.imageUrl || product.image_url || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {/* Bagian Interaksi */}
          {/* Pastikan text di dalam komponen ProductInteraction juga menggunakan text-[#122D4F] */}
          <div className="text-[#122D4F]"> 
            <ProductInteraction 
                product={{
                    ...product,
                    image_url: product.imageUrl || product.image_url || "/placeholder.png", 
                    price_per_day: product.pricePerDay || product.price_per_day || 0
                }} 
            />
          </div>

        </div>

        {/* Bagian Ulasan */}
        {/* Border pemisah diperhalus */}
        <div className="border-t border-gray-300 pt-10">
            <h2 className="text-2xl font-bold text-[#122D4F] mb-6">Ulasan Pelanggan</h2>
            
            {/* Pastikan ReviewSection juga menyesuaikan warna text */}
            <div className="text-[#122D4F]">
                <ReviewSection reviews={product.reviews || []} />
            </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
}