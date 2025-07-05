import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent border-t border-gray-800 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between text-center md:text-left">
          {/* Logo & About */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <Link href="/" className="text-2xl font-bold text-white">
              Sport<span className="text-teal-400">Gear</span>
            </Link>
            <p className="mt-2 text-sm text-gray-400 max-w-xs mx-auto md:mx-0">
              Kami adalah website penyewaan alat olahraga terlengkap dan terpercaya.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-6 md:mb-0">
            <div>
              <h3 className="font-semibold text-white mb-3">Tentang Kami</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-400 hover:text-teal-400">Tentang</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-teal-400">Karir</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-400 hover:text-teal-400">Email</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-teal-400">Instagram</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-teal-400">Twitter</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-400 hover:text-teal-400">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-teal-400">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>Copyright © {currentYear} SportGear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}