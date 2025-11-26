"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StarIcon } from "@heroicons/react/24/solid";
import { submitReview } from "@/lib/api";

// ⭐ UI Bintang Rating Component
const StarRating = ({ rating, setRating }: { rating: number; setRating: any }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        className={`h-10 w-10 cursor-pointer transition ${
          rating >= star ? "text-yellow-400" : "text-gray-600"
        }`}
        onClick={() => setRating(star)}
      />
    ))}
  </div>
);

export default function BeriUlasanPage() {
  const router = useRouter();
  const { productId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) return alert("⚠️ Pilih rating dulu ya!");
    if (comment.trim().length < 5) return alert("⚠️ Komentar minimal 5 karakter.");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/login?redirect_to=/ulasan/${productId}`);
      return;
    }

    setLoading(true);

    const result = await submitReview(
      Number(productId),
      rating,
      comment
    );

    setLoading(false);

    if (!result.success) {
      alert(`❌ Gagal mengirim ulasan: ${result.error || "Unknown error"}`);
      return;
    }

    alert("⭐ Terima kasih! Ulasan kamu berhasil dikirim.");
    router.push(`/produk/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Beri Ulasan
          </h1>

          <form onSubmit={handleSubmitReview} className="space-y-6">

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Komentar
              </label>
              <textarea
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis pengalamanmu tentang produk ini..."
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-teal-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-500"
            >
              {loading ? "Mengirim..." : "Kirim Ulasan"}
            </button>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
