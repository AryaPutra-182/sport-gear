
import { StarIcon } from '@heroicons/react/24/solid';

// Mendefinisikan tipe data untuk ulasan yang diterima
type Review = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
};

// Komponen kecil untuk menampilkan bintang berdasarkan rating
const Stars = ({ rating, className = 'h-5 w-5' }: { rating: number, className?: string }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`${className} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewSection({ reviews }: { reviews: Review[] | null }) {
  // Jika tidak ada ulasan, tampilkan pesan
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-12 py-8 px-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Ulasan Produk</h2>
        <p className="text-gray-400">Belum ada ulasan untuk produk ini.</p>
      </div>
    );
  }

  // Menghitung rata-rata rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="mt-12 py-8 px-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Ulasan Produk</h2>
      
      {/* Bagian Ringkasan Rating */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700">
        <p className="text-4xl font-bold text-white">{averageRating.toFixed(1)}</p>
        <div>
          <Stars rating={Math.round(averageRating)} className="h-7 w-7" />
          <p className="text-sm text-gray-400">dari {reviews.length} ulasan</p>
        </div>
      </div>

      {/* Daftar Ulasan Individual */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                {/* Untuk saat ini kita tampilkan sebagai anonim */}
                <p className="font-semibold text-white">Pengguna Anonim</p>
                <Stars rating={review.rating} />
              </div>
              <p className="text-sm text-gray-400">
                {new Date(review.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            {review.comment && (
              <p className="mt-3 text-gray-300 leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
