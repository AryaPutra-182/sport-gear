import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';

export default function HomePage() {
  // Ganti 'hero-background.jpg' dengan nama file gambar Anda jika berbeda
  const backgroundImageUrl = '/hero-background.jpg'; 

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      {/* Container utama untuk Hero Section dan Navbar */}
      <header 
        className="relative h-screen" 
        style={{ 
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center' 
        }}
      >
        {/* Lapisan overlay gelap agar teks mudah dibaca */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Navbar diposisikan di atas overlay */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Konten Hero Section */}
        <div className="relative z-10 flex items-center justify-center md:justify-start h-full">
          <div className="container mx-auto px-6 text-center md:text-left">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Let's Rent Sport Equipment
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                SportGear hadir untuk memudahkan kamu mengakses peralatan olahraga terbaik tanpa harus membeli. Dari sepeda, bola, hingga raket, kami menyediakan beragam pilihan sesuai kebutuhan aktivitasmu. 
              </p>
              <Link
                href="/register"
                className="mt-8 inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition duration-300"
              >
                SIGN UP NOW
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Bagian lain dari Halaman Utama bisa ditambahkan di sini */}
      <main>
        {/* Contoh: Nanti kita akan tambahkan halaman produk di sini */}
        <div className="py-20 text-center">
            <h2 className="text-3xl font-bold text-white">Konten Selanjutnya...</h2>
        </div>
      </main>

      <Footer />
    </div>
  );
}