'use client'

import { useSearchParams } from 'next/navigation'
import LoginForm from './LoginForm'

export default function LoginPageClient() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/produk'

  return <LoginForm redirectTo={redirectTo} />
}
