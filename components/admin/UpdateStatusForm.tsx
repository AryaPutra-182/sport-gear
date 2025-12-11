"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateStatusForm({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  // MODAL STATE
  const [modal, setModal] = useState<{
    open: boolean;
    msg: string;
    success: boolean;
  }>({
    open: false,
    msg: "",
    success: false,
  });

  const handleUpdate = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        setModal({
          open: true,
          msg: "Gagal memperbarui status.",
          success: false,
        });
      } else {
        setModal({
          open: true,
          msg: "Status berhasil diperbarui!",
          success: true,
        });

        router.refresh();
      }
    } catch {
      setModal({
        open: true,
        msg: "Terjadi kesalahan saat update status.",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  return (
    <>
      {/* FORM ASLI — tidak ada perubahan UI */}
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <div className="relative flex-grow">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full appearance-none bg-white text-[#122D4F] px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#122D4F] focus:border-transparent font-medium shadow-sm transition-all cursor-pointer"
          >
            <option value="unpaid">Menunggu Pembayaran</option>
            <option value="paid">Sudah Dibayar</option>
            <option value="dikemas">Sedang Dikemas</option>
            <option value="dikirim">Sedang Dikirim</option>
            <option value="selesai">Selesai</option>
            <option value="batal">Dibatalkan</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#122D4F]">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isLoading || status === currentStatus}
          className={`px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-md ${
              isLoading || status === currentStatus
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-[#122D4F] hover:bg-[#0C2E4E] hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          {isLoading ? "Menyimpan..." : "Simpan Status"}
        </button>
      </div>


      {/* ====== MODAL UI PROFESIONAL ====== */}
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
    </>
  );
}
