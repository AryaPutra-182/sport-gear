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

interface Product {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  stock: number;
  imageUrl: string;
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
    setPrice(product.pricePerDay.toString());
    setStock(product.stock.toString());
    setCategoryId(product.categoryId);
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
        // ✅ PERBAIKAN DISINI: Update State Langsung (Instant UI Update)
        
        const newData = res.data; // Data produk baru dari backend

        if (editingId) {
          // Logic Edit: Ganti item lama dengan yang baru
          setProducts((prev) => 
            prev.map((p) => (p.id === editingId ? newData : p))
          );
          alert("Produk diperbarui!");
        } else {
          // Logic Tambah: Masukkan item baru ke paling atas
          setProducts((prev) => [newData, ...prev]);
          alert("Produk ditambahkan!");
        }

        setIsModalOpen(false);
        resetForm(); // Bersihkan form
        
        // Tetap panggil refresh agar server component sinkron di background
        router.refresh(); 
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <input 
            type="text" 
            placeholder="Cari nama produk..." 
            className="bg-gray-50 text-[#122D4F] px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent w-full md:w-1/3 transition placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#122D4F] hover:bg-[#0C2E4E] text-white px-5 py-2.5 rounded-lg font-bold transition shadow-md hover:shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          Tambah Produk
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full text-left text-gray-600">
          <thead className="bg-[#122D4F] text-white uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4">Gambar</th>
              <th className="p-4">Nama Produk</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga / Hari</th>
              <th className="p-4">Stok</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-[#F7F5E9] transition-colors">
                <td className="p-4">
                  <div className="w-14 h-14 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-bold text-[#122D4F]">{product.name}</td>
                <td className="p-4">
                    <span className="bg-blue-50 text-[#122D4F] px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                        {product.category?.name || "Uncategorized"}
                    </span>
                </td>
                <td className="p-4 font-mono text-[#122D4F] font-bold">
                    Rp {(product.pricePerDay || 0).toLocaleString("id-ID")}
                </td>
                
                <td className="p-4 font-medium">{product.stock}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleOpenEdit(product)} className="text-gray-400 hover:text-[#F4B400] transition-colors p-1" title="Edit">
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Hapus">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-400 italic">
                        Tidak ada produk yang ditemukan.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-[#122D4F]">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              
              {/* Area Upload Gambar */}
              <div>
                <label className="block text-sm font-bold text-[#122D4F] mb-2">Foto Produk</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-300 flex items-center justify-center flex-shrink-0">
                    {previewImage ? (
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                    ) : existingImageUrl ? (
                      <Image src={existingImageUrl} alt="Existing" fill className="object-cover opacity-90" />
                    ) : (
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
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
                      <p className="text-xs text-gray-400 mt-2">
                        Format: JPG, PNG, WEBP. Maks 2MB.
                      </p>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div>
                <label className="label-text">Nama Produk</label>
                <input type="text" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Harga (Per Hari)</label>
                  <input type="number" required className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className="label-text">Stok</label>
                  <input type="number" required className="input-field" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label-text">Kategori</label>
                <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="label-text">Deskripsi</label>
                <textarea rows={3} className="input-field resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-[#122D4F] hover:bg-[#0C2E4E] text-white font-bold py-3.5 rounded-lg transition-all shadow-md mt-2 disabled:opacity-50">
                {isLoading ? "Menyimpan..." : "Simpan Data"}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Styles Lokal untuk Input */}
      <style jsx>{`
        .label-text {
          display: block;
          font-size: 0.875rem; /* text-sm */
          font-weight: 700;
          color: #122D4F;
          margin-bottom: 0.5rem;
        }
        .input-field {
          width: 100%;
          background-color: #ffffff;
          color: #1F2937; /* gray-800 */
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #D1D5DB; /* gray-300 */
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #122D4F;
          box-shadow: 0 0 0 2px rgba(18, 45, 79, 0.1);
        }
      `}</style>
    </div>
  );
}