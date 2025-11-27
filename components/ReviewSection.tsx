import { StarIcon } from "@heroicons/react/24/solid";

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-gray-500 italic bg-white p-6 rounded-lg border border-gray-200">
        Belum ada ulasan untuk produk ini.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#122D4F] flex items-center justify-center text-white font-bold">
                {review.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[#122D4F]">{review.user.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", { dateStyle: 'long' })}
                </p>
              </div>
            </div>
            
            {/* Bintang */}
            <div className="flex bg-[#F7F5E9] px-2 py-1 rounded-lg border border-[#122D4F]/10">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "text-[#F4B400]" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {review.comment || "Tidak ada komentar tertulis."}
          </p>
        </div>
      ))}
    </div>
  );
}