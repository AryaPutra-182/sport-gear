// app/components/admin/DeleteCategoryButton.tsx

"use client";

import { deleteCategory } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({ categoryId, imageUrl }: { categoryId: number, imageUrl: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Anda yakin ingin menghapus kategori ini? Produk dalam kategori ini tidak akan terhapus.")) {
      setIsLoading(true);
      const result = await deleteCategory(categoryId, imageUrl);
      if (!result.success) {
        alert("Gagal menghapus kategori.");
      } else {
        router.refresh();
      }
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading} className="font-medium text-red-500 hover:underline disabled:text-gray-400">
      {isLoading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
