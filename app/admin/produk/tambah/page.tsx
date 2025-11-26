import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductForm from "@/components/admin/ProductForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- AUTH CHECK FUNCTION ---
async function validateAdmin() {
  const token = cookies().get("token")?.value;

  if (!token) redirect("/login?redirect_to=/admin/produk/tambah");

  const res = await fetch("http://localhost:4000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const user = await res.json();

  if (!user || user.role !== "admin") redirect("/");

  return token;
}

// --- FETCH CATEGORY DATA FROM BACKEND ---
async function getCategories(token: string) {
  const res = await fetch("http://localhost:4000/api/categories", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function TambahProdukPage() {
  const token = await validateAdmin();
  const categories = await getCategories(token);

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Tambah Produk Baru
          </h1>

          {/* Product form now receives real backend data */}
          <ProductForm categories={categories} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
