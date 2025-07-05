// app/components/AuthButton.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fungsi untuk mengambil data sesi pengguna saat ini
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    // Mendengarkan perubahan status autentikasi (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Membersihkan listener saat komponen tidak lagi digunakan
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh(); // Memaksa refresh untuk membersihkan state
  };

  // Jika ada user yang login, tampilkan email dan tombol logout
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300 hidden sm:block">
  {user.user_metadata.full_name || user.email}
</span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-red-600 text-white py-2 px-4 rounded-full transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  // Jika tidak ada user, tampilkan tombol profile/login
  return (
    <Link href="/login" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition-colors">
      <UserCircleIcon className="h-5 w-5" />
      <span>Profile</span>
    </Link>
  );
}