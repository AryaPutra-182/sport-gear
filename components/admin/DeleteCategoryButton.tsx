"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/api";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeleteCategoryButton({ id }: { id: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false); // modal konfirmasi
  const [loading, setLoading] = useState(false);

  // Modal tambahan untuk error
  const [errorModal, setErrorModal] = useState<{
    open: boolean;
    msg: string;
  }>({
    open: false,
    msg: "",
  });

  const handleDelete = async () => {
    setLoading(true);

    const res = await deleteCategory(id);

    if (res.error) {
      setLoading(false);
      setOpen(false); // tutup modal konfirmasi
      setErrorModal({
        open: true,
        msg: res.error,
      });
      return;
    }

    setLoading(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      {/* BUTTON TRIGGER */}
      <button
        onClick={() => setOpen(true)}
        className="text-red-400 hover:text-red-300 transition"
        title="Hapus"
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      {/* MODAL KONFIRMASI */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-xl border border-gray-200">

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center shadow-inner">
                <TrashIcon className="h-7 w-7 text-red-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#122D4F] text-center mb-2">
              Hapus Kategori?
            </h3>

            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Menghapus kategori dapat menyebabkan produk terkait bermasalah.
              Lanjutkan?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="w-1/2 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-1/2 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ERROR */}
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-xl border border-gray-200">

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 3h.01M4.93 4.93l14.14 14.14M12 20c4.418 0 8-3.582 8-8S16.418 4 12 4 4 7.582 4 12s3.582 8 8 8z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#122D4F] text-center mb-2">
              Gagal Menghapus
            </h3>

            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {errorModal.msg}
            </p>

            <button
              onClick={() => setErrorModal({ open: false, msg: "" })}
              className="w-full py-3 rounded-lg bg-[#122D4F] text-white font-semibold hover:bg-[#0f223c] transition"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </>
  );
}
