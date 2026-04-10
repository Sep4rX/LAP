'use client'

import useSWR from 'swr'
import { MacroData } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useMacroData() {
  const { data, error, isLoading, mutate } = useSWR<MacroData>(
    '/api/macro',
    fetcher,
    {
      refreshInterval: 600000, // 10 minutes
      revalidateOnFocus: false,
    },
  )

  return {
    macro: data,
    error,
    isLoading,
    mutate,
  }
}
