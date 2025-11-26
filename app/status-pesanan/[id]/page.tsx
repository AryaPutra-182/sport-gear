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
      <div className="flex justify-center items-center min-h-screen bg-[#0D1117] text-white">
        Loading Status...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white">Detail Status Pesanan #{id}</h1>
            <p className="text-gray-400 mt-2">
               Status Saat Ini: <span className="text-teal-400 font-bold uppercase">{trackingData?.currentStatus}</span>
            </p>
          </div>

          {/* Maps Dummy */}
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 border border-gray-700 relative h-64 w-full">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.2096054388!2d112.6426426368457!3d-7.275614063847083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381ac47f%3A0x3027a76e352be40!2sSurabaya%2C%20Surabaya%20City%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }} 
                allowFullScreen 
                loading="lazy" 
             />
          </div>

          {/* TIMELINE STATUS */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
              Riwayat Perjalanan
            </h2>

            {trackingData && trackingData.history && trackingData.history.length > 0 ? (
              <div className="space-y-8 relative pl-8 border-l-2 border-gray-700 ml-2">
                
                {trackingData.history.map((log: any, index: number) => (
                  <div key={log.id} className="relative">
                    {/* Dot Indicator */}
                    <span className={`absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-[#0D1117] ${index === 0 ? "bg-teal-500 animate-pulse" : "bg-gray-500"}`}></span>
                    
                    {/* Content */}
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <h3 className="text-white font-bold text-lg">{log.statusText}</h3>
                        <p className="text-sm text-gray-400 mt-1">{formatDate(log.timestamp)}</p>
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <div className="text-center py-10 bg-gray-700/30 rounded-lg">
                <p className="text-gray-400">Belum ada data riwayat status.</p>
                <p className="text-xs text-gray-500 mt-1">
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