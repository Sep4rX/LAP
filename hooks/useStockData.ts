'use client'

import useSWR from 'swr'
import { OHLCVData, TechnicalIndicators } from '@/types'

interface StockDataResponse {
  ohlcv: OHLCVData[]
  indicators: TechnicalIndicators
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useStockData(ticker: string, enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<StockDataResponse>(
    enabled && ticker ? `/api/stocks?ticker=${ticker}` : null,
    fetcher,
    {
      refreshInterval: 3600000, // 1 hour
      revalidateOnFocus: false,
    },
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}
