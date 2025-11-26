"use client";

import { deleteCategory } from "@/lib/api";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeleteCategoryButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Yakin hapus kategori ini? Produk di dalamnya mungkin akan error.")) return;

    const res = await deleteCategory(id);
    if (res.error) {
        alert("Gagal hapus: " + res.error);
    } else {
        router.refresh();
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:text-red-300 transition" title="Hapus">
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}