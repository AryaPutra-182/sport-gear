// app/components/ProductInteraction.tsx

"use client";

import { useState } from 'react';
import { useBookingStore, BookingItem } from '@/store/useBookingStore'; // Impor store kita

// ... (fungsi formatCurrency biarkan saja)
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

type Product = {
  id: number;
  name: string;
  description: string;
  price_per_day: number;
  image_url: string;
}

export default function ProductInteraction({ product }: { product: Product }) {
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const durations = [3, 7, 14, 30];
  
  // Ambil fungsi 'addItem' dari store kita
  const addItem = useBookingStore((state) => state.addItem);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    const newItem: BookingItem = {
      id: product.id,
      name: product.name,
      price_per_day: product.price_per_day,
      image_url: product.image_url,
      quantity: quantity,
      duration: selectedDuration,
    };
    addItem(newItem);
    alert(`${product.name} telah ditambahkan ke keranjang sewa!`); // Memberi notifikasi sederhana
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-white">{product.name}</h1>
      {/* ... (bagian harga dan deskripsi tidak berubah) ... */}
       <p className="text-3xl font-semibold text-teal-400">
        {formatCurrency(product.price_per_day)} / hari
      </p>
      <div className="text-gray-300 leading-relaxed">
        <p>{product.description}</p>
      </div>
      
      {/* Opsi Durasi Sewa (tidak berubah) */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Durasi Sewa</h3>
        <div className="flex flex-wrap gap-3">
          {durations.map(duration => (
            <button 
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                selectedDuration === duration 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {duration} Hari
            </button>
          ))}
        </div>
      </div>

      {/* Opsi Jumlah (tidak berubah) */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Jumlah</h3>
        <div className="flex items-center gap-4 bg-gray-700 rounded-md p-2 max-w-min">
            <button onClick={() => handleQuantityChange(-1)} className="text-white text-xl font-bold px-3">-</button>
            <span className="text-white text-lg w-8 text-center">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="text-white text-xl font-bold px-3">+</button>
        </div>
      </div>

      {/* Tombol Aksi (TAMBAHKAN onClick) */}
      <button 
        onClick={handleAddToCart}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Pesan Sekarang
      </button>
    </div>
  );
}