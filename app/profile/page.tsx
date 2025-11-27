"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login?redirect_to=/profile");
        return;
      }

      try {
        const res = await getMe();
        
        // Backend return bisa: user OR {success:true, data:user}
        const userData = res?.user || res?.data || res;

        if (!userData || res?.error) {
          localStorage.removeItem("token");
          router.push("/login?redirect_to=/profile");
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5E9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#122D4F]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Card Container */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          
          {/* Header Profile dengan Avatar Inisial */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-[#122D4F] rounded-full flex items-center justify-center text-[#F4B400] text-4xl font-bold mb-4 shadow-md border-4 border-white ring-2 ring-gray-100">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h1 className="text-3xl font-extrabold text-[#122D4F]">Profil Saya</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola informasi akun Anda</p>
          </div>

          <div className="space-y-6">
            
            {/* Nama Lengkap */}
            <div className="group">
              <p className="text-sm font-bold text-[#122D4F] uppercase tracking-wider mb-2">Nama Lengkap</p>
              <div className="bg-[#F7F5E9] p-4 rounded-lg border border-gray-200 text-gray-800 font-medium">
                {user.name || "Belum diatur"}
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <p className="text-sm font-bold text-[#122D4F] uppercase tracking-wider mb-2">Email</p>
              <div className="bg-[#F7F5E9] p-4 rounded-lg border border-gray-200 text-gray-800 font-medium">
                {user.email}
              </div>
            </div>

            {/* Role */}
            <div className="group">
              <p className="text-sm font-bold text-[#122D4F] uppercase tracking-wider mb-2">Role Akun</p>
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${
                    user.role === 'admin' 
                    ? 'bg-[#122D4F] text-[#F4B400]' 
                    : 'bg-[#F4B400] text-[#122D4F]'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Card (Optional Logout Button here) */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-400">Bergabung sejak {new Date(user.createdAt || Date.now()).toLocaleDateString('id-ID')}</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}