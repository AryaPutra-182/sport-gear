import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

// ✅ PERBAIKAN 1: Sesuaikan nama file import (CategoryForm.tsx)
import CategoryForm from "@/components/admin/AddCategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

// --- Validasi Admin ---
async function validateAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/login?redirect_to=/admin/kategori");

  const res = await fetch("http://localhost:4000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const json = await res.json();
  const user = json.data || json;

  if (!user || user.role !== "admin") redirect("/");
  return token;
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
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Manajemen Kategori</h1>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM TAMBAH */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                Tambah Kategori
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
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-teal-500 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                      
                      {/* ✅ PERBAIKAN 2: Gunakan 'imageUrl' (CamelCase) sesuai Prisma */}
                      <Image
                        src={category.imageUrl || "/placeholder-category.jpg"} 
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                        <p className="text-xs text-gray-500">ID: {category.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Tombol Edit */}
                    <Link href={`/admin/kategori/edit/${category.id}`} className="text-blue-400 hover:text-blue-300" title="Edit">
                       <PencilSquareIcon className="h-5 w-5" />
                    </Link>

                    {/* Tombol Hapus */}
                    <DeleteCategoryButton id={category.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
                Belum ada kategori yang ditambahkan.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}