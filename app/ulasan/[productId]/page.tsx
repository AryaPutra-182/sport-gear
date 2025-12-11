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

  // Modal state
  const [modal, setModal] = useState<{
    open: boolean;
    msg: string;
    success: boolean;
  }>({
    open: false,
    msg: "",
    success: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setModal({
        open: true,
        msg: "Mohon berikan bintang minimal 1.",
        success: false,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await submitReview(Number(productId), rating, comment);

      if (res.error) {
        setModal({
          open: true,
          msg: res.error,
          success: false,
        });
      } else {
        setModal({
          open: true,
          msg: "Terima kasih! Ulasan Anda berhasil dikirim.",
          success: true,
        });
      }
    } catch {
      setModal({
        open: true,
        msg: "Terjadi kesalahan sistem.",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });

    if (modal.success) {
      router.push(`/produk/${productId}`);
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
            {/* RATING */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-bold text-[#122D4F] mb-3">
                Rating
              </label>
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
                {rating > 0
                  ? ["Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus"][rating - 1]
                  : ""}
              </p>
            </div>

            {/* KOMENTAR */}
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

            {/* BUTTON SUBMIT */}
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

      {/* ================= MODAL ================= */}
      {modal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-[#122D4F] text-center mb-3">
              Informasi
            </h3>

            <p className="text-gray-600 text-center mb-6">{modal.msg}</p>

            <button
              onClick={closeModal}
              className="w-full py-3 rounded-lg bg-[#122D4F] text-white font-semibold hover:bg-[#0f223c] transition shadow-md"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
