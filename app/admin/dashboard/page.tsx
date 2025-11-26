import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Import yang lebih rapi

async function getUserFromBackend() {
  // 1. Ambil token dari Cookie
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?redirect_to=/admin/dashboard");
  }

  try {
    // 2. Fetch User Data
    const res = await fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", // Pastikan data selalu fresh
    });

    const json = await res.json();

    // 3. Normalisasi Data (Cek apakah ada di json.data atau json langsung)
    const userData = json.data || json; // <-- PENTING

    if (!userData || json.error) {
       // Token invalid/expired
       redirect("/login?redirect_to=/admin/dashboard");
    }

    // 4. Cek Role Admin
    if (userData.role !== "admin") {
      redirect("/"); // Tendang user biasa ke Home
    }

    return userData;

  } catch (error) {
    console.error("Admin Auth Error:", error);
    redirect("/login");
  }
}

export default async function AdminDashboardPage() {
  const user = await getUserFromBackend();

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-4xl font-bold text-white">
                Dashboard Admin
             </h1>
             <span className="bg-teal-500 text-white px-3 py-1 rounded text-sm font-bold">
                ADMIN ACCESS
             </span>
          </div>

          <p className="text-lg text-gray-300">
            Selamat datang, <span className="font-bold text-teal-400">{user.name}</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">Logged in as: {user.email}</p>

          <hr className="border-gray-700 my-8" />

          {/* Menu Admin Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <a href="/admin/produk" className="group block p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all border border-transparent hover:border-teal-500">
              <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">📦 Manajemen Produk</h3>
              <p className="mt-2 text-gray-400 text-sm">Tambah produk baru, update stok, atau hapus produk lama.</p>
            </a>

            <a href="/admin/pesanan" className="group block p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all border border-transparent hover:border-teal-500">
              <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">📄 Manajemen Pesanan</h3>
              <p className="mt-2 text-gray-400 text-sm">Lihat semua pesanan masuk, update status pembayaran & pengiriman.</p>
            </a>

            <a href="/admin/kategori" className="group block p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all border border-transparent hover:border-teal-500">
              <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">🏷️ Manajemen Kategori</h3>
              <p className="mt-2 text-gray-400 text-sm">Atur kategori alat olahraga untuk memudahkan pencarian.</p>
            </a>
            
            <a href="/" className="group block p-6 bg-gray-700/50 rounded-lg hover:bg-gray-600 transition-all border border-gray-600">
              <h3 className="text-xl font-bold text-white">🏠 Ke Halaman Utama</h3>
              <p className="mt-2 text-gray-400 text-sm">Kembali ke tampilan user biasa.</p>
            </a>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}