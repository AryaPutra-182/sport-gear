

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { StarIcon } from "@heroicons/react/24/solid";

// Komponen untuk menampilkan bintang rating
function StarRating({ rating, setRating }: { rating: number; setRating: (rating: number) => void; }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-10 w-10 cursor-pointer ${
            star <= rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}

export default function BeriUlasanPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Mohon berikan rating bintang terlebih dahulu.");
      return;
    }
    setIsLoading(true);

    // Dapatkan user yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Anda harus login untuk memberikan ulasan.");
      setIsLoading(false);
      return;
    }

    // Simpan ulasan ke database
    const { error } = await supabase.from("reviews").insert({
      product_id: Number(productId),
      user_id: user.id,
      rating: rating,
      comment: comment,
    });

    setIsLoading(false);

    if (error) {
      alert("Gagal mengirim ulasan: " + error.message);
    } else {
      alert("Terima kasih atas ulasan Anda!");
      // Arahkan kembali ke halaman produk setelah berhasil
      router.push(`/produk/${productId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Beri Ulasan
          </h1>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Beri Rating
              </label>
              <StarRating rating={rating} setRating={setRating} />
            </div>
            <div>
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-300 mb-2">
                Deskripsi
              </label>
              <textarea
                id="deskripsi"
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Bagaimana pengalaman Anda dengan produk ini?"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
