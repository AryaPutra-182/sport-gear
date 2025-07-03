import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';
import Image from 'next/image'; // Impor komponen Image dari Next.js
import { supabase } from '@/lib/supabaseClient'; // Pastikan path ini sesuai dengan struktur proyek Anda

// Mendefinisikan tipe data untuk kategori agar kode lebih aman
interface Category {
  id: number;
  name: string;
  image_url: string;
}

// Ubah fungsi menjadi 'async' untuk bisa mengambil data
export default async function HomePage() {
  const backgroundImageUrl = '/hero-background.jpg';

  // --- BLOK PENGAMBILAN DATA ---
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    // Anda bisa menampilkan pesan error di sini jika perlu
  }
  // --- AKHIR BLOK PENGAMBILAN DATA ---

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      {/* Header dengan Hero Section */}
      <header 
        className="relative h-screen" 
        style={{ 
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center' 
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10"><Navbar /></div>
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
      
      {/* Konten Utama */}
      <main className="container mx-auto px-6 py-20">
        {/* --- BAGIAN POPULAR CATEGORIES --- */}
        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category: Category) => (
              <Link key={category.id} href={`/products?category=${category.name}`} className="group block relative overflow-hidden rounded-lg">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* --- AKHIR BAGIAN POPULAR CATEGORIES --- */}
      </main>

      <Footer />
    </div>
  );
}