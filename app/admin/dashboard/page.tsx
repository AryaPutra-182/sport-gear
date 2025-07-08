// app/admin/dashboard/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

// Fungsi keamanan untuk memeriksa peran admin
async function checkAdminRole() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect_to=/admin/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  return user;
}

export default async function AdminDashboardPage() {
  const user = await checkAdminRole();

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Selamat Datang, Admin!
          </h1>
          <p className="text-lg text-gray-300">
            Ini adalah halaman Dashboard Admin Anda.
          </p>
          <p className="text-gray-400 mt-2">
            Login sebagai: {user.email}
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kartu untuk Manajemen Produk */}
            <Link href="/admin/produk" className="block p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <h3 className="text-xl font-semibold text-white">Manajemen Produk</h3>
              <p className="mt-2 text-gray-400">Tambah, edit, atau hapus produk.</p>
            </Link>

            {/* Kartu Manajemen Pesanan */}
            <Link href="/admin/pesanan" className="block p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <h3 className="text-xl font-semibold text-white">Manajemen Pesanan</h3>
              <p className="mt-2 text-gray-400">Lihat pesanan dan perbarui status.</p>
            </Link>

            {/* PERUBAHAN DI SINI: Kartu Manajemen Kategori */}
            <Link href="/admin/kategori" className="block p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <h3 className="text-xl font-semibold text-white">Manajemen Kategori</h3>
              <p className="mt-2 text-gray-400">Tambah atau lihat kategori produk.</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
