'use client'

import useSWR from 'swr'
import { PredictionResult } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function usePredictions(ticker: string, enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<PredictionResult>(
    enabled && ticker ? `/api/predict?ticker=${ticker}` : null,
    fetcher,
    {
      refreshInterval: 1800000, // 30 minutes
      revalidateOnFocus: false,
    },
  )

  return {
    prediction: data,
    error,
    isLoading,
    mutate,
  }
}
