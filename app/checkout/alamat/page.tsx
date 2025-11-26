"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { addAddress } from "@/lib/api";

export default function AlamatPage() {
  const router = useRouter();

  // State Form (Hapus City & PostalCode)
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login?redirect_to=/checkout/alamat");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Payload disesuaikan dengan Schema Prisma (Hanya 4 field utama)
      const payload = {
        recipient_name: recipientName,
        phone_number: phoneNumber,
        full_address: fullAddress, // User mengetik kota/kodepos di sini saja
        notes: notes,
      };

      const response = await addAddress(payload);

      if (response.error) {
        alert("Gagal menyimpan alamat: " + response.error);
        setIsLoading(false);
        return;
      }

      router.push("/checkout/pembayaran"); 

    } catch (error) {
      console.error("Error submit address:", error);
      alert("Terjadi kesalahan sistem.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Detail Alamat Pengiriman
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nama Penerima */}
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">
                Nama Lengkap Penerima
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">
                Nomor Telepon (WhatsApp)
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            {/* Alamat Lengkap (Diperjelas Placeholdernya) */}
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">
                Alamat Lengkap
              </label>
              <textarea
                rows={5}
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
                placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, KOTA, KODE POS..."
              />
              <p className="text-xs text-gray-500 mt-2">*Mohon tuliskan Kota dan Kode Pos di sini.</p>
            </div>

            {/* Catatan */}
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">
                Catatan Kurir (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Pagar warna hitam, titip di pos satpam, dll."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3 rounded-lg mt-6 transition-all shadow-lg ${
                isLoading 
                ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20"
              }`}
            >
              {isLoading ? "Menyimpan Data..." : "Simpan & Lanjut Bayar"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}