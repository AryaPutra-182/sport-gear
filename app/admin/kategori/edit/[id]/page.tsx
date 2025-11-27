import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
// ✅ Use the Reusable Form Component
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
async function getCategory(id: string, token: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Fetch failed");

    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error("Error fetch category:", error);
    return null;
  }
}

// --- PAGE COMPONENT ---
export default async function EditKategoriPage({ params }: { params: { id: string } }) {
  const token = await validateAdmin();
  const category = await getCategory(params.id, token);

  if (!category) {
    notFound();
  }

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Card Container Putih */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          
          {/* Header Form */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-3xl font-extrabold text-[#122D4F]">
                Edit Kategori
            </h1>
            <a 
                href="/admin/kategori" 
                className="text-gray-400 hover:text-[#122D4F] text-sm font-medium underline transition-colors"
            >
                Batal & Kembali
            </a>
          </div>

          {/* Oper data kategori lama ke Form */}
          <CategoryForm initialData={category} />
        </div>
      </main>

      <Footer />
    </div>
  );
}