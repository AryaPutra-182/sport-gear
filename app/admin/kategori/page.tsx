// app/admin/kategori/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import AddCategoryForm from "@/components/admin/AddCategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

async function checkAdminRole() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect_to=/admin/kategori');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');
}

export default async function AdminKategoriPage() {
  await checkAdminRole();
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const { data: categories } = await supabase.from('categories').select('*').order('created_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Tambah/Edit Kategori</h2>
              <AddCategoryForm />
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Daftar Kategori</h2>
              <div className="space-y-4">
                {categories && categories.length > 0 ? (
                  categories.map(category => (
                    <div key={category.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-md">
                      <div className="flex items-center gap-4">
                        <Image src={category.image_url} alt={category.name} width={50} height={50} className="rounded-md object-cover" />
                        <span className="font-semibold text-white">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/kategori/edit/${category.id}`} className="font-medium text-blue-500 hover:underline">Edit</Link>
                        <DeleteCategoryButton categoryId={category.id} imageUrl={category.image_url} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Belum ada kategori.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
