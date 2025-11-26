import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductForm from "@/components/admin/ProductForm";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";

// --- Validasi Admin ---
async function validateAdmin() {
  const token = cookies().get("token")?.value;

  if (!token) redirect("/login?redirect_to=/admin/produk");

  const res = await fetch("http://localhost:4000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const json = await res.json();
  const user = json.data || json;

  if (!user || user.role !== "admin") redirect("/");

  return token;
}

// --- Fetch Helpers ---
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

async function getProduct(id: string, token: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 404) return null;

    const json = await res.json();
    return json.data || json; // Handle struktur response { data: ... }
  } catch (e) {
    return null;
  }
}

// ---- PAGE COMPONENT ----
export default async function EditProdukPage({ params }: { params: { id: string } }) {
  const token = await validateAdmin();

  const [product, categories] = await Promise.all([
    getProduct(params.id, token),
    getCategories(token),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-6">
             <h1 className="text-3xl font-bold text-white text-center flex-grow">
               Edit Produk
             </h1>
             {/* Tombol kembali optional */}
             <a href="/admin/produk" className="text-gray-400 hover:text-white text-sm underline">
                Batal
             </a>
          </div>

          {/* Kirim data produk lama (product) ke initialData */}
          <ProductForm categories={categories} initialData={product} />
        </div>
      </main>

      <Footer />
    </div>
  );
}