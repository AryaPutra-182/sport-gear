"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitReview } from "@/lib/api";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export default function BeriUlasanPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Mohon berikan bintang (1-5).");
      return;
    }

    setIsLoading(true);

    try {
      // Kirim ke API (Pastikan submitReview di api.ts sudah benar)
      const res = await submitReview(Number(productId), rating, comment);

      if (res.error) {
        alert(res.error);
      } else {
        alert("Terima kasih! Ulasan Anda berhasil dikirim.");
        router.push(`/produk/${productId}`); // Balik ke halaman produk
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12 flex justify-center items-center">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-extrabold text-[#122D4F] text-center mb-2">
            Beri Ulasan
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Bagaimana pengalaman Anda menggunakan produk ini?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* INPUT BINTANG */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-bold text-[#122D4F] mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform transform hover:scale-110"
                  >
                    {star <= (hoverRating || rating) ? (
                      <StarIcon className="h-10 w-10 text-[#F4B400]" />
                    ) : (
                      <StarOutline className="h-10 w-10 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-[#F4B400] font-medium mt-2 h-5">
                {rating > 0 ? ["Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus"][rating - 1] : ""}
              </p>
            </div>

            {/* INPUT KOMENTAR */}
            <div>
              <label className="block text-sm font-bold text-[#122D4F] mb-2">
                Komentar Anda
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#122D4F] focus:ring-1 focus:ring-[#122D4F] text-gray-700 placeholder-gray-400"
                placeholder="Ceritakan pengalaman Anda..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* TOMBOL SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3.5 rounded-lg shadow-md transition-all ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#122D4F] hover:bg-[#0C2E4E] text-white hover:shadow-lg"
              }`}
            >
              {isLoading ? "Mengirim..." : "Kirim Ulasan"}
            </button>

            <button
                type="button"
                onClick={() => router.back()}
                className="w-full text-sm text-gray-500 hover:text-[#122D4F] hover:underline"
            >
                Batal
            </button>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}