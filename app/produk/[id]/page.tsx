import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import ProductInteraction from "@/app/components/ProductInteraction";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function DetailProdukPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Logika pengambilan data tetap di sini (Server Component)
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
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

          {/* Kolom Kiri: Gambar Produk (tetap di sini) */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image 
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Kolom Kanan: Komponen Interaktif (memanggil komponen baru) */}
          <ProductInteraction product={product} />

        </div>
      </main>

      <Footer />
    </div>
  )
}
