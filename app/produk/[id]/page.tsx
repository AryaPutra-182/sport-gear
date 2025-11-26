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

        // Cek validitas respon
        if (!res || res.error || res.status === 404) {
          console.error("Produk tidak ditemukan:", res?.error);
          router.push("/404"); // Pastikan Anda punya halaman 404.tsx atau ganti ke "/"
          return;
        }

        // Ambil data yang benar (sesuai format backend: res.data atau res)
        const productData = res.data || res;
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-white">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">

          {/* Bagian Gambar */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <Image 
              // Handle berbagai kemungkinan nama field gambar
              src={product.imageUrl || product.image_url || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Bagian Interaksi (Harga, Deskripsi, Tombol Sewa) */}
          {/* Pastikan data dikirim dengan format yang benar ke komponen ini */}
          <ProductInteraction 
            product={{
                ...product,
                // Pastikan nama field konsisten untuk child component
                image_url: product.imageUrl || product.image_url || "/placeholder.png", 
                price_per_day: product.pricePerDay || product.price_per_day || 0
            }} 
          />

        </div>

        {/* Bagian Ulasan */}
        <div className="border-t border-gray-700 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">Ulasan Pelanggan</h2>
            <ReviewSection reviews={product.reviews || []} />
        </div>
        
      </main>

      <Footer />
    </div>
  );
}