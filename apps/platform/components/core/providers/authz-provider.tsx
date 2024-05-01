'use client'

import { Constants } from '@/utils/constants'
import { Auth0Provider } from '@auth0/auth0-react'

interface AuthzProviderProps {
  children: React.ReactNode
}

export const AuthzProvider = ({ children }: AuthzProviderProps) => {
  return (
    <Auth0Provider
      domain={Constants.auth0.domain}
      clientId={Constants.auth0.clientId}
      authorizationParams={{
        redirect_uri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : '',
        audience: Constants.auth0.audience,
        scope: Constants.auth0.scope,
      }}
    >
      {children}
    </Auth0Provider>
  )
}
