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
      const payload = {
        recipient_name: recipientName,
        phone_number: phoneNumber,
        full_address: fullAddress,
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
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        
        {/* Card Container Putih dengan Shadow */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          
          <h1 className="text-3xl font-extrabold text-[#122D4F] text-center mb-8">
            Detail Alamat Pengiriman
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nama Penerima */}
            <div>
              <label className="text-sm font-bold text-[#122D4F] mb-2 block">
                Nama Lengkap Penerima
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition shadow-sm placeholder-gray-400"
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="text-sm font-bold text-[#122D4F] mb-2 block">
                Nomor Telepon (WhatsApp)
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition shadow-sm placeholder-gray-400"
              />
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="text-sm font-bold text-[#122D4F] mb-2 block">
                Alamat Lengkap
              </label>
              <textarea
                rows={5}
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition resize-none shadow-sm placeholder-gray-400"
                placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, KOTA, KODE POS..."
              />
              <p className="text-xs text-gray-500 mt-2 font-medium">*Mohon tuliskan Kota dan Kode Pos di sini.</p>
            </div>

            {/* Catatan */}
            <div>
              <label className="text-sm font-bold text-[#122D4F] mb-2 block">
                Catatan Kurir (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Pagar warna hitam, titip di pos satpam, dll."
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition shadow-sm placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3.5 rounded-lg mt-8 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isLoading 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-[#F4B400] hover:bg-[#e0a500] text-[#122D4F]"
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