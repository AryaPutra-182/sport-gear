/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // PERBAIKAN FINAL: Satu pola yang lebih umum untuk semua bucket publik
      {
        protocol: 'https',
        hostname: 'jcqdaszxzmxzyqnjyhmz.supabase.co', // Pastikan ini hostname Anda
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
