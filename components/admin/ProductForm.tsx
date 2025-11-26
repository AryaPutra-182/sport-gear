"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/api"; // Pastikan updateProduct sudah ada di api.ts
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";

// Interface untuk data produk
interface ProductData {
  id?: number;
  name: string;
  description: string;
  price_per_day: number;
  stock: number;
  image_url: string;
  categoryId: number;
}

interface Props {
  categories: any[];
  initialData?: ProductData; // Opsional: Hanya ada saat Edit
}

export default function ProductForm({ categories, initialData }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE INIT (Isi dengan data lama jika ada, atau kosong jika baru) ---
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price_per_day?.toString() || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  
  // State Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview gambar baru
  const [existingImage, setExistingImage] = useState<string | null>(initialData?.image_url || null); // Gambar lama

  // Handle Pilih Gambar Baru
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Tampilkan preview file lokal
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price_per_day", price);
      formData.append("stock", stock);
      formData.append("categoryId", categoryId.toString());

      // Kirim gambar HANYA JIKA user memilih file baru
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (initialData && initialData.id) {
        // --- MODE EDIT (PUT) ---
        res = await updateProduct(initialData.id, formData);
      } else {
        // --- MODE TAMBAH (POST) ---
        res = await createProduct(formData);
      }

      if (res.error) {
        alert("Gagal: " + res.error);
      } else {
        alert(initialData ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
        router.push("/admin/produk"); // Kembali ke list produk
        router.refresh(); // Refresh agar data terbaru muncul
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Upload Gambar */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Foto Produk</label>
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden relative border border-gray-600 flex items-center justify-center flex-shrink-0">
            {previewImage ? (
              // Tampilkan gambar yang baru dipilih user
              <Image src={previewImage} alt="Preview" fill className="object-cover" />
            ) : existingImage ? (
              // Tampilkan gambar lama dari database
              <Image src={existingImage} alt="Existing" fill className="object-cover opacity-80" />
            ) : (
              // Icon kosong
              <PhotoIcon className="h-8 w-8 text-gray-500" />
            )}
          </div>
          
          <div className="flex-grow">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-teal-500 file:text-white
                hover:file:bg-teal-600
                cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">
              {initialData ? "Biarkan kosong jika tidak ingin mengubah foto." : "Format: JPG, PNG, WEBP. Maks 2MB."}
            </p>
          </div>
        </div>
      </div>

      {/* Nama Produk */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nama Produk</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-teal-500 outline-none"
        />
      </div>

      {/* Harga & Stok */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Harga / Hari</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Stok</label>
          <input
            type="number"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-teal-500 outline-none"
          />
        </div>
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Kategori</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-teal-500 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
        <textarea
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-teal-500 outline-none resize-none"
        />
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
      >
        {isLoading ? "Menyimpan..." : initialData ? "Update Produk" : "Simpan Produk"}
      </button>
    </form>
  );
}