// app/admin/kategori/edit/[id]/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
// Kita akan buat komponen AddCategoryForm bisa untuk edit juga
import AddCategoryForm from "@/components/admin/AddCategoryForm";

export default async function EditKategoriPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Edit Kategori
          </h1>
          {/* Kita akan oper 'initialData' ke form yang sama */}
          <AddCategoryForm initialData={category} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
