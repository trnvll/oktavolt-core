import { HttpConfig } from '@/utils/client'
import { useClient } from '@/utils/hooks/client'
import { createFetcher } from '@/utils/fetcher'

export function useFetcher<T>(config?: HttpConfig) {
  const client = useClient()
  return createFetcher<T>(client, config)
}
