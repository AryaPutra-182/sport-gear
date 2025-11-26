"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, deleteProduct } from "@/lib/api";
import { PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface Category {
  id: number;
  name: string;
}

// ✅ UPDATE 1: Sesuaikan Interface dengan return Prisma (CamelCase)
interface Product {
  id: number;
  name: string;
  description: string;
  pricePerDay: number; // Ubah dari price_per_day
  stock: number;
  imageUrl: string;    // Ubah dari image_url
  categoryId: number;
  category?: Category;
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

export default function AdminProductClient({ initialProducts, categories }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State Form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  
  // State Khusus Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  // --- HANDLERS ---

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId(categories[0]?.id || 1);
    setImageFile(null);
    setPreviewImage(null);
    setExistingImageUrl("");
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    // ✅ UPDATE 2: Ambil value dari pricePerDay
    setPrice(product.pricePerDay.toString());
    setStock(product.stock.toString());
    setCategoryId(product.categoryId);
    // ✅ UPDATE 3: Ambil value dari imageUrl
    setExistingImageUrl(product.imageUrl || ""); 
    setPreviewImage(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    const res = await deleteProduct(id);
    if (res.error) return alert("Gagal hapus: " + res.error);
    
    // Update UI local
    setProducts((prev) => prev.filter((p) => p.id !== id));
    router.refresh(); 
    alert("Produk berhasil dihapus");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      // Controller Backend mengharapkan 'price_per_day' (Snake Case) dari Form
      formData.append("price_per_day", price); 
      formData.append("stock", stock);
      formData.append("categoryId", categoryId.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (editingId) {
        res = await updateProduct(editingId, formData);
      } else {
        res = await createProduct(formData);
      }

      if (res.error) {
        alert(res.error);
      } else {
        alert(editingId ? "Produk diperbarui!" : "Produk ditambahkan!");
        setIsModalOpen(false);
        router.refresh(); // Refresh data server component
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-lg">
        <input 
            type="text" 
            placeholder="Cari nama produk..." 
            className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-bold transition"
        >
          <PlusIcon className="h-5 w-5" />
          Tambah Produk
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-900 text-white uppercase text-sm font-bold">
            <tr>
              <th className="p-4">Gambar</th>
              <th className="p-4">Nama Produk</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga / Hari</th>
              <th className="p-4">Stok</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-700/50 transition">
                <td className="p-4">
                  <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-600">
                    {/* ✅ UPDATE 4: Gunakan imageUrl */}
                    <Image
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-semibold text-white">{product.name}</td>
                <td className="p-4"><span className="bg-gray-700 px-2 py-1 rounded text-xs">{product.category?.name || "Uncategorized"}</span></td>
                
                {/* ✅ UPDATE 5: Gunakan pricePerDay. Pastikan ada fallback (|| 0) */}
                <td className="p-4 text-teal-400 font-mono">
                    Rp {(product.pricePerDay || 0).toLocaleString("id-ID")}
                </td>
                
                <td className="p-4">{product.stock}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button onClick={() => handleOpenEdit(product)} className="text-blue-400 hover:text-blue-300"><PencilSquareIcon className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM (Sama seperti sebelumnya, tapi pastikan variabel state benar) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-lg border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* Area Upload Gambar */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Foto Produk</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden relative border border-gray-600 flex items-center justify-center flex-shrink-0">
                    {previewImage ? (
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                    ) : existingImageUrl ? (
                      <Image src={existingImageUrl} alt="Existing" fill className="object-cover opacity-70" />
                    ) : (
                      <PhotoIcon className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                     <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 cursor-pointer"
                      />
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nama Produk</label>
                <input type="text" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Harga (Per Hari)</label>
                  <input type="number" required className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stok</label>
                  <input type="number" required className="input-field" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Kategori</label>
                <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
                <textarea rows={3} className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded mt-4 disabled:opacity-50">
                {isLoading ? "Menyimpan..." : "Simpan Data"}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .input-field {
          width: 100%;
          background-color: #374151;
          color: white;
          padding: 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #4B5563;
          outline: none;
        }
        .input-field:focus {
          border-color: #14B8A6;
        }
      `}</style>
    </div>
  );
}