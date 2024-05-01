import { useAuth0 } from '@auth0/auth0-react'
import { useCallback } from 'react'
import { client, HttpConfig } from '@/utils/client'

export function useClient() {
  const { getAccessTokenSilently } = useAuth0()

  return useCallback(
    async <T>(url: string, config?: HttpConfig): Promise<T> => {
      const authToken = await getAccessTokenSilently()
      return client(url, {
        ...config,
        token: authToken,
      })
    },
    [getAccessTokenSilently],
  )
}
