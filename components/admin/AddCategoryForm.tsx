// app/components/admin/AddCategoryForm.tsx

"use client";

import { useState } from 'react';
import { addCategory, updateCategory } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Mendefinisikan tipe data untuk initialData
type Category = {
  id: number;
  name: string;
  image_url: string;
};

// Komponen sekarang menerima initialData opsional
export default function AddCategoryForm({ initialData }: { initialData?: Category }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    let result;
    if (initialData) {
      // Panggil aksi update
      result = await updateCategory(initialData.id, formData);
    } else {
      // Panggil aksi tambah
      result = await addCategory(formData);
    }

    if (result?.error) {
      alert(`Gagal: ${result.error}`);
    } else {
      alert(`Kategori berhasil di${initialData ? 'perbarui' : 'tambahkan'}!`);
      // Kembali ke halaman daftar kategori setelah berhasil
      router.push('/admin/kategori');
      router.refresh();
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nama Kategori</label>
        <input type="text" id="name" name="name" required defaultValue={initialData?.name} className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500" />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">Gambar Kategori</label>
        {initialData && (
          <div className="mb-2">
            <p className="text-xs text-gray-400 mb-1">Gambar Saat Ini:</p>
            <Image src={initialData.image_url} alt={initialData.name} width={100} height={100} className="rounded-md object-cover" />
          </div>
        )}
        <input type="file" id="image" name="image" required={!initialData} accept="image/*" className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
        {initialData && <p className="text-xs text-gray-400 mt-1">Pilih file baru jika ingin mengubah gambar.</p>}
      </div>
      <button type="submit" disabled={isLoading} className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-500">
        {isLoading ? 'Menyimpan...' : (initialData ? 'Update Kategori' : 'Tambah Kategori')}
      </button>
    </form>
  );
}
