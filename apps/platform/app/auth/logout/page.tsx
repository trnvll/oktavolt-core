'use client'

import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { useEffect } from 'react'

function Logout() {
  const { logout } = useAuth0()
  useEffect(() => {
    void logout({ logoutParams: { returnTo: window.location.origin } })
  }, [logout, window.location.origin])

  return null
}

export default withAuthenticationRequired(Logout)
