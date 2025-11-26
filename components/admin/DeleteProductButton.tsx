"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ productId, imageUrl }: { productId: number, imageUrl: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus produk ini? Tindakan ini tidak bisa dibatalkan.");

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda harus login sebagai admin!");
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus produk");
      }

      alert("Produk berhasil dihapus!");
      router.refresh();

    } catch (error: any) {
      alert(error.message);
    }

    setIsDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="font-medium text-red-500 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Menghapus..." : "Hapus"}
    </button>
  );
}
