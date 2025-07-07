"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions";

export default function UpdateStatusForm({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Daftar status baru dalam format yang mudah dibaca dan disimpan
  const statusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'dikemas', label: 'Dikemas' },
    { value: 'dikirim', label: 'Dikirim' },
    { value: 'selesai', label: 'Selesai' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateOrderStatus(orderId, status);
    if (!result.success) {
      alert("Gagal memperbarui status: " + result.error);
    } else {
      alert("Status pesanan berhasil diperbarui!");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 mt-4">
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        className="bg-gray-700 text-white rounded-md border-gray-600 focus:ring-teal-500 focus:border-teal-500"
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <button 
        type="submit"
        disabled={isLoading}
        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500"
      >
        {isLoading ? 'Menyimpan...' : 'Update Status'}
      </button>
    </form>
  );
}