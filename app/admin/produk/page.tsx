import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminProductClient from "./adminProductClient";

// 1. Fungsi Fetch Data di Server (Secure)
async function getAdminData() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    // A. Cek User (Apakah Admin?)
    const resUser = await fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const userJson = await resUser.json();
    const user = userJson.data || userJson;

    if (!user || user.role !== "admin") return null;

    // B. Ambil Semua Produk
    const resProducts = await fetch("http://localhost:4000/api/products", {
       cache: "no-store" 
    });
    const jsonProducts = await resProducts.json();

    // C. Ambil Kategori (Untuk Form Dropdown)
    const resCategories = await fetch("http://localhost:4000/api/categories", {
        cache: "no-store"
    });
    const jsonCategories = await resCategories.json();

    return {
      products: Array.isArray(jsonProducts.data) ? jsonProducts.data : [],
      categories: Array.isArray(jsonCategories.data) ? jsonCategories.data : [],
    };

  } catch (error) {
    console.error("Fetch Admin Error:", error);
    return null;
  }
}

export default async function AdminProdukPage() {
  const data = await getAdminData();

  // Jika data null (Token expired atau bukan admin), tendang ke login
  if (!data) {
    redirect("/login?redirect_to=/admin/produk");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-4xl font-bold text-white">Manajemen Produk</h1>
                <p className="text-gray-400 mt-2">Kelola daftar alat olahraga yang disewakan.</p>
            </div>
            <a href="/admin/dashboard" className="text-gray-400 hover:text-white underline">
                &larr; Kembali ke Dashboard
            </a>
        </div>

        {/* Panggil Client Component untuk Interaksi */}
        <AdminProductClient 
            initialProducts={data.products} 
            categories={data.categories} 
        />
        
      </main>

      <Footer />
    </div>
  );
}