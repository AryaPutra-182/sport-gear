import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminProductClient from "./adminProductClient"; // Ensure file casing matches

// 1. Server-Side Data Fetching
async function getAdminData() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    // A. Check User (Is Admin?)
    const resUser = await fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const userJson = await resUser.json();
    const user = userJson.data || userJson;

    if (!user || user.role !== "admin") return null;

    // B. Fetch All Products
    const resProducts = await fetch("http://localhost:4000/api/products", {
       cache: "no-store" 
    });
    const jsonProducts = await resProducts.json();

    // C. Fetch Categories (For Dropdown)
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

  // Redirect if invalid token or not admin
  if (!data) {
    redirect("/login?redirect_to=/admin/produk");
  }

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-extrabold text-[#122D4F]">Manajemen Produk</h1>
                <p className="text-gray-600 mt-2 font-medium">Kelola daftar alat olahraga yang disewakan.</p>
            </div>
            
            <a 
                href="/admin/dashboard" 
                className="text-[#122D4F] hover:text-[#F4B400] font-bold underline transition-colors flex items-center gap-2"
            >
                &larr; Kembali ke Dashboard
            </a>
        </div>

        {/* Client Component for Interaction */}
        <AdminProductClient 
            initialProducts={data.products} 
            categories={data.categories} 
        />
        
      </main>

      <Footer />
    </div>
  );
}