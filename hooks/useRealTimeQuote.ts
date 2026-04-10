'use client'

import useSWR from 'swr'
import { QuoteData } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useRealTimeQuote(ticker: string, interval: number = 15000) {
  const { data, error, isLoading, mutate } = useSWR<QuoteData>(
    ticker ? `/api/quote?ticker=${ticker}` : null,
    fetcher,
    {
      refreshInterval: interval,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  )

  return {
    quote: data,
    error,
    isLoading,
    mutate,
  }
}
