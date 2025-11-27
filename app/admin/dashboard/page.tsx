import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { 
  CubeIcon, 
  ClipboardDocumentListIcon, 
  TagIcon, 
  HomeIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

async function getUserFromBackend() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?redirect_to=/admin/dashboard");
  }

  try {
    const res = await fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();
    const userData = json.data || json;

    if (!userData || json.error) {
       redirect("/login?redirect_to=/admin/dashboard");
    }

    if (userData.role !== "admin") {
      redirect("/");
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
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#122D4F]">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Selamat datang kembali, <span className="font-bold text-[#122D4F]">{user.name}</span>!
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
              System Online
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card: Produk */}
          <Link href="/admin/produk" className="group relative bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <CubeIcon className="w-24 h-24 text-[#122D4F]" />
            </div>
            <div className="w-14 h-14 bg-[#F7F5E9] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#122D4F] transition-colors">
              <CubeIcon className="w-8 h-8 text-[#122D4F] group-hover:text-[#F4B400] transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-[#122D4F] mb-2">Produk</h3>
            <p className="text-gray-500 mb-6">
              Kelola inventaris, update stok, dan tambahkan alat olahraga baru.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-[#F4B400] group-hover:text-[#122D4F] transition-colors">
              Kelola Produk <ArrowRightIcon className="w-4 h-4 ml-2" />
            </span>
          </Link>

          {/* Card: Pesanan */}
          <Link href="/admin/pesanan" className="group relative bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <ClipboardDocumentListIcon className="w-24 h-24 text-[#122D4F]" />
            </div>
            <div className="w-14 h-14 bg-[#F7F5E9] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#122D4F] transition-colors">
              <ClipboardDocumentListIcon className="w-8 h-8 text-[#122D4F] group-hover:text-[#F4B400] transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-[#122D4F] mb-2">Pesanan</h3>
            <p className="text-gray-500 mb-6">
              Pantau pesanan masuk, verifikasi pembayaran, dan update status pengiriman.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-[#F4B400] group-hover:text-[#122D4F] transition-colors">
              Lihat Pesanan <ArrowRightIcon className="w-4 h-4 ml-2" />
            </span>
          </Link>

          {/* Card: Kategori */}
          <Link href="/admin/kategori" className="group relative bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <TagIcon className="w-24 h-24 text-[#122D4F]" />
            </div>
            <div className="w-14 h-14 bg-[#F7F5E9] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#122D4F] transition-colors">
              <TagIcon className="w-8 h-8 text-[#122D4F] group-hover:text-[#F4B400] transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-[#122D4F] mb-2">Kategori</h3>
            <p className="text-gray-500 mb-6">
              Atur pengelompokan produk agar mudah ditemukan oleh pelanggan.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-[#F4B400] group-hover:text-[#122D4F] transition-colors">
              Atur Kategori <ArrowRightIcon className="w-4 h-4 ml-2" />
            </span>
          </Link>

          {/* Card: Back to Home */}
          <Link href="/" className="group relative bg-[#122D4F] p-8 rounded-2xl shadow-md border border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 lg:col-span-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <HomeIcon className="w-8 h-8 text-[#F4B400]" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Halaman Utama</h3>
                    <p className="text-blue-200">Kembali ke tampilan website pengguna.</p>
                </div>
            </div>
            <div className="bg-[#F4B400] text-[#122D4F] p-3 rounded-full group-hover:scale-110 transition-transform">
                <ArrowRightIcon className="w-6 h-6" />
            </div>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
}