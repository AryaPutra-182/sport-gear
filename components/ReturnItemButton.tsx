"use client";

import { useState } from "react";
import { requestItemReturn } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ReturnItemButton({ orderId }: { orderId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReturn = async () => {
    const confirmed = window.confirm("Anda yakin ingin memulai proses pengembalian untuk pesanan ini?");
    if (confirmed) {
      setIsLoading(true);
      const result = await requestItemReturn(orderId);
      if (result.success) {
        alert("Permintaan pengembalian berhasil dibuat.");
        router.refresh(); // Refresh halaman untuk melihat status baru
      } else {
        alert("Gagal membuat permintaan pengembalian: " + result.error);
      }
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleReturn}
      disabled={isLoading}
      className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
    >
      {isLoading ? "Memproses..." : "Kembalikan Barang"}
    </button>
  );
}