// app/components/ProductCard.tsx

import Image from 'next/image';
import Link from 'next/link';

// Mendefinisikan tipe data untuk props komponen ini
interface ProductCardProps {
  id: number;
  name: string;
  price_per_day: number;
  image_url: string;
}

// Fungsi untuk format harga ke Rupiah
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ProductCard({ id, name, price_per_day, image_url }: ProductCardProps) {
  return (
    <Link href={`/produk/${id}`} className="block group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300 h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-white truncate flex-grow">{name}</h3>
          <p className="text-md font-bold text-teal-400 mt-2">
            {formatCurrency(price_per_day)} / hari
          </p>
        </div>
      </div>
    </Link>
  );
}