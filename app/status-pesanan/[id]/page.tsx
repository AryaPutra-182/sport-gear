import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";

const formatTimestamp = (timestamp: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(timestamp));
};

export default async function StatusPesananPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  // Ambil data pesanan utama untuk memastikan pesanan itu ada
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .single();

  // Jika pesanan itu sendiri tidak ditemukan, tampilkan 404
  if (orderError || !order) {
    notFound();
  }

  // Ambil data riwayat status untuk pesanan ini
  const { data: history, error: historyError } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', orderId)
    .order('timestamp', { ascending: true });

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-10">
            Detail Status Pesanan #{orderId}
          </h1>
          
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <div className="mb-8 overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.873293992263!2d112.73801447499966!3d-7.255955092749978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f942c6141c39%3A0x1d43a54b38356dd!2sTunjungan%20Plaza!5e0!3m2!1sen!2sid!4v1720199812345!5m2!1sen!2sid"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Timeline Status */}
            <div className="relative border-l-2 border-teal-500 ml-3">
              {history && history.length > 0 ? (
                history.map((status) => (
                  <div key={status.id} className="mb-8 ml-8">
                    <span className="absolute -left-[11px] flex items-center justify-center w-6 h-6 bg-teal-500 rounded-full ring-8 ring-gray-800"></span>
                    <p className="text-sm text-gray-400">{formatTimestamp(status.timestamp)}</p>
                    <h3 className="text-lg font-semibold text-white">{status.status_text}</h3>
                  </div>
                ))
              ) : (
                // Tampilkan pesan ini jika tidak ada riwayat
                <div className="ml-8 text-gray-400">
                  <p>Belum ada pembaruan status untuk pesanan ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}