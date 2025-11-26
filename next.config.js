/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ 1. UTAMA: Izinkan gambar dari Backend Lokal (Port 4000)
      {
        protocol: 'http', // Localhost pakai 'http', bukan 'https'
        hostname: 'localhost',
        port: '4000',     // Sesuaikan dengan port backend Anda
        pathname: '/uploads/**', // Izinkan akses ke folder uploads
      },
      
      // ✅ 2. Izinkan Placehold.co (Untuk gambar dummy/placeholder)
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },

      // ✅ 3. Izinkan Supabase (Opsional: Hapus jika sudah tidak pakai Supabase)
      {
        protocol: 'https',
        hostname: 'jcqdaszxzmxzyqnjyhmz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;