// app/components/AuthButton.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { UserCircleIcon, ArrowRightOnRectangleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

// Definisikan tipe untuk profil
type Profile = {
  role: string;
};

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fungsi untuk mengambil data sesi dan profil pengguna
    const getInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      // Jika ada user, ambil profilnya
      if (currentUser) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        setProfile(userProfile);
      }
    };
    
    getInitialData();

    // Mendengarkan perubahan status autentikasi (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      // Jika user logout, hapus data profil
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      } else if (currentUser) {
        // Jika user login, ambil profilnya
        supabase.from('profiles').select('role').eq('id', currentUser.id).single().then(({ data }) => {
          setProfile(data);
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // Jika ada user yang login
  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* Tampilkan tombol Mode Admin jika perannya adalah 'admin' */}
        {profile?.role === 'admin' && (
          <Link href="/admin/dashboard" className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded-full transition-colors text-sm font-semibold">
            <WrenchScrewdriverIcon className="h-5 w-5" />
            <span>Mode Admin</span>
          </Link>
        )}

        <Link href="/profile" className="text-sm text-gray-300 hidden sm:block hover:text-teal-400 transition-colors">
          {user.user_metadata.full_name || user.email}
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-red-600 text-white p-2 sm:py-2 sm:px-4 rounded-full transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  // Jika tidak ada user, tampilkan tombol login
  return (
    <Link href="/login" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition-colors">
      <span>Login</span>
    </Link>
  );
}
