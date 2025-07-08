"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
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
        {/* PERUBAHAN DI SINI: Nama/email sekarang adalah sebuah link */}
        <Link href="/profile" className="text-sm text-gray-300 hidden sm:block hover:text-teal-400 transition-colors">
          {user.user_metadata.full_name || user.email}
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-red-600 text-white py-2 px-4 rounded-full transition-colors"
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