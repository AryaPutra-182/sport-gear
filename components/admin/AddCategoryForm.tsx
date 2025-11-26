"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/lib/api";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface Props {
  initialData?: {
    id: number;
    name: string;
    image_url: string;
  };
}

export default function CategoryForm({ initialData }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState(initialData?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image_url || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (initialData) {
        res = await updateCategory(initialData.id, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res.error) {
        alert(res.error);
      } else {
        alert(initialData ? "Kategori diperbarui!" : "Kategori ditambahkan!");
        
        // Reset form jika mode tambah
        if (!initialData) {
            setName("");
            setImageFile(null);
            setPreviewImage(null);
        }
        
        router.refresh(); // Refresh halaman agar list update
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Upload Gambar */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Ikon Kategori</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden relative border border-gray-600 flex items-center justify-center flex-shrink-0">
            {previewImage ? (
              <Image src={previewImage} alt="Preview" fill className="object-cover" />
            ) : (
              <PhotoIcon className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Nama Kategori */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nama Kategori</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-teal-500 outline-none"
          placeholder="Contoh: Sepatu Lari"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
      >
        {isLoading ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Kategori"}
      </button>
    </form>
  );
}