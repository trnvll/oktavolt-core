'use client'

import useSWR from 'swr'
import { Constants } from '@/utils/constants'
import { useFetcher } from '@/utils/hooks/fetcher'

export function useProfile(id: number) {
  const fetcher = useFetcher<any>()
  return useSWR(`${Constants.apiUrl}/users/${id}`, fetcher)
}
