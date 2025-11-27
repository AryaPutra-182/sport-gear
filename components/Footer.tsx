import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C2E4E] text-white mt-20">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">

          <div className="md:w-1/3 text-center md:text-left">
            <Link href="/" className="text-2xl font-semibold">
              Rentletics
            </Link>
            <p className="mt-2 text-sm text-gray-300 max-w-xs mx-auto md:mx-0">
              Platform penyewaan alat olahraga lengkap dan mudah digunakan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-center md:text-left">

            <div>
              <h3 className="font-semibold mb-3">Tentang</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-300 hover:text-gray-200">Profil</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-gray-200">Karir</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Hubungi</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-300 hover:text-gray-200">Email</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-gray-200">Instagram</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-gray-200">Twitter</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-300 hover:text-gray-200">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-gray-200">Terms & Services</Link></li>
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-5 text-center text-sm text-gray-300">
          © {currentYear} Rentletics — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
