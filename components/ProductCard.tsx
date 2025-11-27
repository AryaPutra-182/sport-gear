import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: number;
  name: string;
  // Update: Terima string atau number untuk jaga-jaga
  price_per_day: number | string; 
  image_url: string;
  description?: string;
}

// ✅ FIX: Logic Anti-NaN
const formatCurrency = (amount: number | string) => {
  // 1. Konversi ke Number
  const numericAmount = Number(amount);

  // 2. Jika hasil konversi NaN (Not a Number), pakai 0
  // 3. Jika amount undefined/null, pakai 0
  const safeAmount = isNaN(numericAmount) ? 0 : numericAmount;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(safeAmount);
};

export default function ProductCard({ id, name, price_per_day, image_url, description }: ProductCardProps) {
  return (
    <Link href={`/produk/${id}`} className="block group">
      <div className="bg-[#0C2E4E] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center p-5 h-full">

        {/* IMAGE */}
        <div className="relative w-full h-48 rounded-md overflow-hidden bg-white">
          <Image
            // Fallback gambar jika image_url kosong
            src={image_url || "/placeholder.png"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="flex flex-col flex-grow justify-between w-full mt-5">
            <div>
                <h3 className="text-lg font-bold text-white line-clamp-2">{name}</h3>
                
                {description && (
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">{description}</p>
                )}
            </div>

            {/* PRICE */}
            <div className="mt-4">
                <p className="text-[#F4B400] font-bold text-lg">
                {/* Panggil fungsi format yang sudah diperbaiki */}
                {formatCurrency(price_per_day)} <span className="text-sm text-gray-400 font-normal">/ Hari</span>
                </p>

                {/* BUTTON */}
                <button className="mt-3 w-full bg-[#F4B400] text-[#122D4F] font-semibold text-sm px-5 py-2 rounded-full hover:opacity-90 transition-all">
                SEWA SEKARANG
                </button>
            </div>
        </div>

      </div>
    </Link>
  );
}