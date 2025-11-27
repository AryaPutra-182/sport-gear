"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { useRouter } from "next/navigation";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

type Product = {
  id: number;
  name: string;
  description: string;
  price_per_day: number;
  image_url: string;
};

export default function ProductInteraction({ product }: { product: Product }) {
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const durations = [3, 7, 14, 30];

  const addItem = useBookingStore((state) => state.addItem);
  const router = useRouter();

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price_per_day,
      image: product.image_url,
      quantity,
      duration: selectedDuration,
      price_per_day: product.price_per_day,
    };

    // @ts-ignore – sesuaikan dengan tipe di store-mu
    addItem(newItem);

    router.push("/keranjang");
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-extrabold text-[#122D4F]">{product.name}</h1>

      <p className="text-3xl font-bold text-[#F4B400]">
        {formatCurrency(product.price_per_day)}
        <span className="text-lg text-gray-500 font-normal"> / hari</span>
      </p>

      <div className="text-gray-600 leading-relaxed text-lg">
        <p>{product.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#122D4F] mb-3">Durasi Sewa</h3>
        <div className="flex flex-wrap gap-3">
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm border ${
                selectedDuration === duration
                  ? "bg-[#122D4F] text-white border-[#122D4F] shadow-md scale-105"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#122D4F] hover:text-[#122D4F]"
              }`}
            >
              {duration} Hari
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#122D4F] mb-3">Jumlah</h3>
        <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-lg p-2 max-w-min shadow-sm">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="text-[#122D4F] text-xl font-bold px-4 hover:bg-gray-100 rounded transition"
          >
            -
          </button>
          <span className="text-[#122D4F] text-lg w-8 text-center font-bold">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="text-[#122D4F] text-xl font-bold px-4 hover:bg-gray-100 rounded transition"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-[#F4B400] hover:bg-[#e0a500] text-[#122D4F] font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-2"
      >
        Sewa Sekarang
      </button>
    </div>
  );
}
