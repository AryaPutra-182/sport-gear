import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import CategoryForm from "@/components/admin/AddCategoryForm"; 
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

// --- Validasi Admin ---
async function validateAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/login?redirect_to=/admin/kategori");

  try {
    const res = await fetch("http://localhost:4000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    const json = await res.json();
    const user = json.data || json;

    if (!user || user.role !== "admin") redirect("/");
    return token;
  } catch (error) {
    redirect("/login");
  }
}

// --- Get Categories ---
async function getCategories(token: string) {
  try {
    const res = await fetch("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", 
    });
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (e) {
    return [];
  }
}

export default async function AdminKategoriPage() {
  const token = await validateAdmin();
  const categories = await getCategories(token);

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-extrabold text-[#122D4F]">Manajemen Kategori</h1>
                <p className="text-gray-600 mt-2 font-medium">Atur kategori produk agar lebih mudah ditemukan.</p>
            </div>
            
            <a 
                href="/admin/dashboard" 
                className="text-[#122D4F] hover:text-[#F4B400] font-bold underline transition-colors flex items-center gap-2"
            >
                &larr; Kembali ke Dashboard
            </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM TAMBAH (Card Putih) */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-[#122D4F] mb-6 border-b border-gray-100 pb-4">
                Tambah Kategori Baru
              </h2>
              {/* Form Reusable */}
              <CategoryForm />
            </div>
          </div>

          {/* KOLOM KANAN: LIST KATEGORI */}
          <div className="md:col-span-2 space-y-4">
            {categories.length > 0 ? (
              categories.map((category: any) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-5">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 group-hover:border-[#F4B400] transition-colors">
                      <Image
                        src={category.imageUrl || "/placeholder-category.jpg"} 
                        alt={category.name}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#122D4F] text-lg group-hover:text-[#F4B400] transition-colors">{category.name}</h3>
                        <p className="text-xs text-gray-400 mt-1 font-mono">ID: {category.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Tombol Edit */}
                    <Link 
                        href={`/admin/kategori/edit/${category.id}`} 
                        className="p-2 text-gray-400 hover:text-[#122D4F] hover:bg-gray-50 rounded-full transition-all" 
                        title="Edit"
                    >
                       <PencilSquareIcon className="h-5 w-5" />
                    </Link>

                    {/* Tombol Hapus */}
                    <DeleteCategoryButton id={category.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="text-gray-300 mb-4">
                    {/* Icon Empty State */}
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium">Belum ada kategori yang ditambahkan.</p>
                <p className="text-sm text-gray-400 mt-1">Gunakan formulir di sebelah kiri untuk menambah kategori baru.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}