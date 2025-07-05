// app/produk/[id]/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductInteraction from "@/components/ProductInteraction";
import ReviewSection from "@/components/ReviewSection"; // 1. Impor komponen baru
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export default async function DetailProdukPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  // 2. Query baru untuk mengambil produk DAN ulasannya sekaligus
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      reviews (
        id,
        rating,
        comment,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image 
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <ProductInteraction product={product} />

        </div>

        {/* 3. Tambahkan bagian ulasan di sini */}
        <ReviewSection reviews={product.reviews} />

      </main>

      <Footer />
    </div>
  )
}
