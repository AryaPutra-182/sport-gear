"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";

// Helper Format Tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function StatusPesananPage() {
  const { id } = useParams();
  const router = useRouter();

  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTracking() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch(`http://localhost:4000/api/orders/${id}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (json.success) {
          setTrackingData(json.data);
        }
      } catch (error) {
        console.error("Error network:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTracking();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F7F5E9] text-[#122D4F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#122D4F]"></div>
      </div>
    );
  }

  return (
    // ✅ Background Cream
    <div className="flex flex-col min-h-screen bg-[#F7F5E9]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#122D4F]">Detail Status Pesanan #{id}</h1>
            <p className="text-gray-600 mt-2 font-medium">
               Status Saat Ini: <span className="text-[#F4B400] font-bold uppercase tracking-wider bg-[#122D4F] px-3 py-1 rounded ml-2 text-sm">{trackingData?.currentStatus.replace("_", " ")}</span>
            </p>
          </div>

          {/* Maps Dummy */}
          <div className="bg-white rounded-xl overflow-hidden mb-8 border border-gray-200 shadow-md relative h-64 w-full">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.2096054388!2d112.6426426368457!3d-7.275614063847083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381ac47f%3A0x3027a76e352be40!2sSurabaya%2C%20Surabaya%20City%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} // Hapus filter invert agar peta terlihat normal/cerah
                allowFullScreen 
                loading="lazy" 
             />
          </div>

          {/* TIMELINE STATUS */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-[#122D4F] mb-8 border-b border-gray-100 pb-4">
              Riwayat Perjalanan
            </h2>

            {trackingData && trackingData.history && trackingData.history.length > 0 ? (
              <div className="space-y-8 relative pl-8 border-l-2 border-gray-200 ml-2">
                
                {trackingData.history.map((log: any, index: number) => (
                  <div key={log.id} className="relative group">
                    {/* Dot Indicator */}
                    <span className={`absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-[#F7F5E9] shadow-sm ${
                        index === 0 
                        ? "bg-[#F4B400] scale-125 ring-4 ring-[#F4B400]/20" // Highlight status terbaru
                        : "bg-gray-300"
                    }`}></span>
                    
                    {/* Content Card */}
                    <div className={`p-4 rounded-lg border transition-all ${
                        index === 0 
                        ? "bg-[#F7F5E9] border-[#122D4F]/20 shadow-sm" 
                        : "bg-white border-gray-100"
                    }`}>
                        <h3 className={`font-bold text-lg ${index === 0 ? "text-[#122D4F]" : "text-gray-500"}`}>
                            {log.statusText}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 font-medium">{formatDate(log.timestamp)}</p>
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Belum ada data riwayat status.</p>
                <p className="text-xs text-gray-400 mt-1">
                    (Pesanan ini mungkin dibuat sebelum fitur tracking aktif)
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}