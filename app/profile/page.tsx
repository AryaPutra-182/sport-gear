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

      const res = await getMe();

      console.log("ME RESPONSE:", res);

      // Backend return bisa: user OR {success:true, data:user}
      const userData = res?.user || res?.data || res;

      if (!userData || res?.error) {
        localStorage.removeItem("token");
        router.push("/login?redirect_to=/profile");
      } else {
        setUser(userData);
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-[#0D1117]">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Profil Saya</h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Nama Lengkap</p>
              <p className="text-lg text-white">{user.name || "Belum diatur"}</p>
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg text-white">{user.email}</p>
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            <div>
              <p className="text-sm text-gray-400">Role</p>
              <p className="text-lg text-white capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
