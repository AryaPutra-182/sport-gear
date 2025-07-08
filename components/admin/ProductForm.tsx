"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image'; // Impor komponen Image

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

// Komponen sekarang menerima initialData opsional
export default function ProductForm({ categories, initialData }: { categories: Category[], initialData?: Product }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // State untuk menyimpan URL gambar saat ini
  const [isLoading, setIsLoading] = useState(false);

  // useEffect untuk mengisi form jika ini adalah mode edit
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setPrice(String(initialData.price_per_day));
      setCategoryId(String(initialData.category_id));
      setCurrentImageUrl(initialData.image_url); // Simpan URL gambar yang ada
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ... (Logika submit tidak berubah) ...
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
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }
      
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

      if (initialData) {
        const { error } = await supabase.from('products').update(productData).eq('id', initialData.id);
        if (error) throw error;
        alert('Produk berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        alert('Produk berhasil ditambahkan!');
      }

      router.push('/admin/produk');
      router.refresh();
    } catch (error: any) {
      alert('Gagal memproses produk: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... Form input untuk nama, deskripsi, harga, kategori ... */}
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
      
      {/* PERUBAHAN DI SINI */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">Gambar Produk</label>
        
        {/* Tampilkan gambar yang ada saat ini jika dalam mode edit */}
        {initialData && currentImageUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Gambar Saat Ini:</p>
            <Image 
              src={currentImageUrl} 
              alt={initialData.name} 
              width={150} 
              height={150} 
              className="rounded-md object-cover"
            />
          </div>
        )}

        <input type="file" id="image" onChange={handleImageChange} accept="image/*" className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
        {initialData && <p className="text-xs text-gray-400 mt-1">Pilih file baru jika ingin mengubah gambar.</p>}
      </div>
      
      <button type="submit" disabled={isLoading} className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-500">
        {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
      </button>
    </form>
  );
}