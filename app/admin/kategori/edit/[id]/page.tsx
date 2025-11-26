import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import CategoryForm from "@/components/admin/AddCategoryForm";

// --- 1. Validasi Admin (Server Side) ---
async function validateAdmin() {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login?redirect_to=/admin/kategori");
  }

  try {
    const res = await fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();
    const user = json.data || json;

    if (!user || user.role !== "admin") {
      redirect("/");
    }

    return token;
  } catch (error) {
    redirect("/login");
  }
}

// --- 2. Fetch Single Category (Server Side) ---
// Kita buat fungsi fetch manual di sini karena api.ts menggunakan LocalStorage (Client Only)
async function getCategory(id: string, token: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Fetch failed");

    const json = await res.json();
    return json.data || json; // Handle struktur { data: ... } atau langsung object
  } catch (error) {
    console.error("Error fetch category:", error);
    return null;
  }
}

// --- PAGE COMPONENT ---
export default async function EditKategoriPage({ params }: { params: { id: string } }) {
  // 1. Validasi Admin & Ambil Token
  const token = await validateAdmin();

  // 2. Ambil Data Kategori berdasarkan ID dari URL
  const category = await getCategory(params.id, token);

  // 3. Jika tidak ditemukan, tampilkan halaman 404
  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white text-center flex-grow">
                Edit Kategori
            </h1>
            <a href="/admin/kategori" className="text-gray-400 hover:text-white text-sm underline">
                Batal
            </a>
          </div>

          {/* Oper data kategori lama ke Form */}
          {/* Pastikan Anda sudah membuat CategoryForm.tsx di langkah sebelumnya */}
          <CategoryForm initialData={category} />
        </div>
      </main>

      <Footer />
    </div>
  );
}