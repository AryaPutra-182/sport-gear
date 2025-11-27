"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateStatusForm({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!confirm("Yakin ingin mengubah status pesanan?")) return;
    setIsLoading(true);

    try {
      // Panggil API Backend
      const token = localStorage.getItem("token"); // Admin token
      const res = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Gagal update status");

      alert("Status berhasil diperbarui!");
      router.refresh(); // Refresh halaman agar data server terupdate
    } catch (error) {
      alert("Terjadi kesalahan saat update status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-2">
      <div className="relative flex-grow">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full appearance-none bg-white text-[#122D4F] px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent font-medium shadow-sm transition-all cursor-pointer"
        >
          <option value="unpaid">Menunggu Pembayaran</option>
          <option value="paid">Sudah Dibayar</option>
          <option value="dikemas">Sedang Dikemas</option>
          <option value="dikirim">Sedang Dikirim</option>
          <option value="selesai">Selesai</option>
          <option value="batal">Dibatalkan</option>
        </select>
        
        {/* Panah Dropdown Custom (Agar rapi) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#122D4F]">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        disabled={isLoading || status === currentStatus}
        className={`px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-md ${
            isLoading || status === currentStatus
            ? "bg-gray-400 cursor-not-allowed opacity-70"
            : "bg-[#122D4F] hover:bg-[#0C2E4E] hover:shadow-lg transform hover:-translate-y-0.5"
        }`}
      >
        {isLoading ? "Menyimpan..." : "Simpan Status"}
      </button>
    </div>
  );
}