import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  // 1. Dapatkan user yang sedang login
  const { data: { user } } = await supabase.auth.getUser();

  // Jika tidak ada user, arahkan ke halaman login
  if (!user) {
    redirect('/login?redirect_to=/profile');
  }

  // 2. Dapatkan profil user dari tabel 'profiles'
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Profil Saya
          </h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Nama Lengkap</p>
              <p className="text-lg text-white">{profile?.full_name || 'Belum diatur'}</p>
            </div>
            <div className="border-t border-gray-700 my-4"></div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg text-white">{profile?.email || user.email}</p>
            </div>
            <div className="border-t border-gray-700 my-4"></div>
            <div>
              <p className="text-sm text-gray-400">Peran</p>
              <p className="text-lg text-white capitalize">{profile?.role}</p>
            </div>
          </div>

          {/* Di sini nanti bisa ditambahkan tombol untuk edit profil */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
