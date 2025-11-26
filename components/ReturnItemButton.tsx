"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId: number;
}

export default function ReturnItemButton({ orderId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReturn = async () => {
    const confirmReturn = window.confirm(
      "Apakah Anda yakin ingin mengajukan permintaan pengembalian pesanan ini?"
    );

    if (!confirmReturn) return;

    setIsLoading(true);

    try {
      // Ambil token dari localStorage (karena login disimpan di client)
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Anda harus login terlebih dahulu.");
        router.push("/login");
        return;
      }

      const res = await fetch(`http://localhost:4000/api/orders/${orderId}/return`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        alert("Gagal mengajukan pengembalian: " + (data.error || "Unknown error"));
      } else {
        alert("Request pengembalian berhasil dikirim!");
        router.refresh();
      }

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server, coba lagi nanti.");
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={handleReturn}
      disabled={isLoading}
      className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
    >
      {isLoading ? "Memproses..." : "Ajukan Pengembalian"}
    </button>
  );
}
