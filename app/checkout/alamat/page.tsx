// app/checkout/alamat/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function AlamatPage() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Ganti user_id dengan ID pengguna yang sedang login nanti
    const { error } = await supabase.from("addresses").insert({
      // user_id: 'USER_ID_NANTI', 
      recipient_name: recipientName,
      phone_number: phoneNumber,
      full_address: fullAddress,
      notes: notes,
    });

    setIsLoading(false);

    if (error) {
      alert("Gagal menyimpan alamat: " + error.message);
    } else {
      alert("Alamat berhasil disimpan!");
      // Arahkan ke halaman selanjutnya, misalnya halaman pembayaran
      router.push('/checkout/pembayaran'); 
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Detail Alamat Pengiriman
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-300 mb-2">
                Nama Lengkap Penerima
              </label>
              <input
                type="text"
                id="nama"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label htmlFor="telepon" className="block text-sm font-medium text-gray-300 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="telepon"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-300 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                id="alamat"
                rows={4}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Provinsi, Kota, Kecamatan, Kode Pos, Nama Jalan, Gedung, RT/RW, Nomor Rumah"
              />
            </div>
            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-300 mb-2">
                Detail Lainnya (Patokan, Opsional)
              </label>
              <input
                type="text"
                id="catatan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Menyimpan...' : 'Konfirmasi Alamat'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}