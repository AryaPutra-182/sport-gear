'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    console.log('📍 RedirectTo received in LoginForm:', redirectTo)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
      } else {
        router.push(redirectTo || '/produk') // ✅ redirect yang benar
      }
    } catch (e) {
      setError('Terjadi kesalahan, silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-white">
            Sport<span className="text-teal-400">Gear</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Login Into SportGear</h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"/>
          </div>
          <div className="text-sm text-right">
            <Link href="/lupa-password" className="font-medium text-gray-400 hover:text-teal-400">Lupa password?</Link>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:bg-gray-500">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-teal-400 hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </div>
  )
}
