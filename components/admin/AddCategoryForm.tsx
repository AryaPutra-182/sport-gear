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
    imageUrl?: string;
    image_url?: string;
  };
}

export default function CategoryForm({ initialData }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.imageUrl || initialData?.image_url || null
  );

  // MODAL STATE → khusus edit
  const [modalOpen, setModalOpen] = useState(false);

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
      if (imageFile) formData.append("image", imageFile);

      let res;
      if (initialData) {
        res = await updateCategory(initialData.id, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res.error) {
        console.error(res.error);
      } else {
        // Tambah kategori → no modal
        if (!initialData) {
          setName("");
          setImageFile(null);
          setPreviewImage(null);
          router.refresh();
          return;
        }

        // Edit kategori → tampilkan modal
        router.refresh();
        setModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    router.push("/admin/kategori");
  };

  return (
    <>
      {/* FORM – tidak berubah sedikit pun */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#122D4F] mb-2">
            Ikon Kategori
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <PhotoIcon className="h-8 w-8 text-gray-400 absolute inset-0 m-auto" />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-[#122D4F] file:text-white
                hover:file:bg-[#0C2E4E]
                cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#122D4F] mb-2">
            Nama Kategori
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent transition placeholder-gray-400"
            placeholder="Contoh: Sepatu Lari"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-3 rounded-lg transition-all shadow-md ${
            isLoading
              ? "bg-gray-400 text-gray-100 cursor-not-allowed"
              : "bg-[#122D4F] hover:bg-[#0C2E4E] text-white hover:shadow-lg"
          }`}
        >
          {isLoading
            ? "Menyimpan..."
            : initialData
            ? "Simpan Perubahan"
            : "Tambah Kategori"}
        </button>
      </form>

      {/* MODAL UNTUK EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-[#122D4F] text-center mb-3">
              Perubahan Disimpan
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Kategori berhasil diperbarui.
            </p>

            <button
              onClick={closeModal}
              className="w-full py-3 rounded-lg bg-[#122D4F] text-white font-semibold hover:bg-[#0f223c] transition shadow-md"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </>
  );
}
