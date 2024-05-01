import { client as httpClient, HttpConfig } from '@/utils/client'

export function createFetcher<T>(
  client: typeof httpClient,
  config?: HttpConfig,
) {
  return function fetcher(url: string): Promise<T> {
    return client<T>(url, config)
  }
}
