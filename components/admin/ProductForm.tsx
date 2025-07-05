
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Mendefinisikan tipe data untuk props
type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  price_per_day: number;
  category_id: number;
  image_url: string;
};

export default function ProductForm({ categories, initialData }: { categories: Category[], initialData?: Product }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setPrice(String(initialData.price_per_day));
      setCategoryId(String(initialData.category_id));
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      alert('Mohon isi nama, harga, dan kategori.');
      return;
    }
    if (!initialData && !imageFile) {
        alert('Mohon pilih gambar produk untuk produk baru.');
        return;
    }
    setIsLoading(true);

    try {
      let imageUrl = initialData?.image_url;

   
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          // Memberikan pesan error yang lebih spesifik jika upload gagal
          throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }
      
      // Memastikan imageUrl tidak kosong sebelum melanjutkan
      if (!imageUrl) {
        throw new Error("URL gambar tidak valid. Proses dibatalkan.");
      }

      const productData = {
        name,
        description,
        price_per_day: Number(price),
        category_id: Number(categoryId),
        image_url: imageUrl,
      };

      // 2. Bedakan antara INSERT (buat baru) dan UPDATE (edit)
      if (initialData) {
        // Mode Edit
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);
        if (error) throw error;
        alert('Produk berhasil diperbarui!');
      } else {
        // Mode Tambah Baru
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        alert('Produk berhasil ditambahkan!');
      }

      router.push('/admin/produk');
      router.refresh();
    } catch (error: any) {
      console.error("Terjadi kesalahan pada handleSubmit:", error);
      alert('Gagal memproses produk: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nama Produk</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
        <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500" />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Harga / Hari (Rp)</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500" />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
        <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500">
          <option value="" disabled>Pilih Kategori</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">Gambar Produk</label>
        <input type="file" id="image" onChange={handleImageChange} accept="image/*" className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
        {initialData && <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin mengubah gambar.</p>}
      </div>
      <button type="submit" disabled={isLoading} className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-500">
        {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
      </button>
    </form>
  );
}
