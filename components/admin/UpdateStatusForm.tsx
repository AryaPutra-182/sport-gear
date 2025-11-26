"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Sesuaikan dengan API update status Anda
// Pastikan di lib/api.ts ada fungsi updateOrderStatus (atau buat fetch manual di sini)

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
      alert("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-teal-500 flex-grow"
      >
        <option value="unpaid">Menunggu Pembayaran</option>
        <option value="paid">Sudah Dibayar</option>
        <option value="dikemas">Sedang Dikemas</option>
        <option value="dikirim">Sedang Dikirim</option>
        <option value="selesai">Selesai</option>
        <option value="batal">Dibatalkan</option>
      </select>

      <button
        onClick={handleUpdate}
        disabled={isLoading || status === currentStatus}
        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
}