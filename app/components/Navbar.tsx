import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  return (
    <nav className="bg-transparent py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Sport<span className="text-teal-400">Gear</span>
        </Link>

        {/* Menu Navigasi Tengah */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-300 hover:text-teal-400 transition-colors">Home</Link>
          <Link href="/chat" className="text-gray-300 hover:text-teal-400 transition-colors">Chat</Link>
          <Link href="/features" className="text-gray-300 hover:text-teal-400 transition-colors">Features</Link>
        </div>

        {/* Tombol Profile */}
        <Link href="/profile" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition-colors">
          <UserIcon className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}