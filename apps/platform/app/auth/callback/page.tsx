'use client'

import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/navigation'
import { getRoutes } from '@/app/utils/links'
import { useEffect } from 'react'

export default function AuthCallback() {
  const { error } = useAuth0()
  const router = useRouter()
  const { Home } = getRoutes()

  useEffect(() => {
    if (!error) {
      router.replace(Home)
    } else {
      console.error(error)
    }
  }, [error, router, Home])

  return null
}
