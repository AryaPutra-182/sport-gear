// app/components/admin/AddCategoryForm.tsx

"use client";

import { useState } from 'react';
import { addCategory } from '@/app/actions';

export default function AddCategoryForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menangani submit form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await addCategory(formData);

    if (result?.error) {
      alert("Gagal menambahkan kategori: " + result.error);
    } else {
      alert("Kategori baru berhasil ditambahkan!");
      // Reset form setelah berhasil
      (event.target as HTMLFormElement).reset();
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nama Kategori</label>
        <input type="text" id="name" name="name" required className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500" />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">Gambar Kategori</label>
        <input type="file" id="image" name="image" required accept="image/*" className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
      </div>
      <button type="submit" disabled={isLoading} className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-500">
        {isLoading ? 'Menyimpan...' : 'Tambah Kategori'}
      </button>
    </form>
  );
}
