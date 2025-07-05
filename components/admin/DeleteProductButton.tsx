"use client";

import { deleteProduct } from "@/app/actions";
import { useState } from "react";

export default function DeleteProductButton({ productId, imageUrl }: { productId: number, imageUrl: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Tampilkan dialog konfirmasi
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak bisa dibatalkan.");
    
    if (confirmed) {
      setIsDeleting(true);
      const result = await deleteProduct(productId, imageUrl);
      if (!result.success) {
        alert("Gagal menghapus produk: " + result.error);
      }
      // Refresh data akan ditangani oleh revalidatePath di server action
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="font-medium text-red-500 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
