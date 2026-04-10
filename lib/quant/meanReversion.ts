import { OHLCVData } from '@/types'

export function calculateMeanReversion(
  closes: number[],
  period: number = 20,
  stdDevMultiplier: number = 2,
): { zscore: number; isOversold: boolean; isOverbought: boolean } {
  if (closes.length < period) {
    return { zscore: 0, isOversold: false, isOverbought: false }
  }

  const recentCloses = closes.slice(-period)
  const mean = recentCloses.reduce((a, b) => a + b, 0) / period
  const variance =
    recentCloses.reduce((a, c) => a + Math.pow(c - mean, 2), 0) / period
  const std = Math.sqrt(variance)

  const zscore = (closes[closes.length - 1] - mean) / (std || 1)
  const isOverbought = zscore > stdDevMultiplier
  const isOversold = zscore < -stdDevMultiplier

  return { zscore, isOversold, isOverbought }
}

export function calculateKDJ(
  ohlcv: OHLCVData[],
): { k: number; d: number; j: number } | null {
  if (ohlcv.length < 14) return null

  const period = 14
  const recentOHLCV = ohlcv.slice(-period)
  const highest = Math.max(...recentOHLCV.map(d => d.high))
  const lowest = Math.min(...recentOHLCV.map(d => d.low))
  const close = ohlcv[ohlcv.length - 1].close

  if (highest === lowest) {
    return { k: 50, d: 50, j: 50 }
  }

  const k = ((close - lowest) / (highest - lowest)) * 100
  const d = k // Simplified, in production would use 3-period SMA
  const j = 3 * k - 2 * d

  return { k, d, j }
}

export function calculatePriceChannel(
  ohlcv: OHLCVData[],
  period: number = 20,
): { upper: number; lower: number; middle: number } {
  const recentOHLCV = ohlcv.slice(-period)
  const highs = recentOHLCV.map(d => d.high)
  const lows = recentOHLCV.map(d => d.low)

  const upper = Math.max(...highs)
  const lower = Math.min(...lows)
  const middle = (upper + lower) / 2

  return { upper, lower, middle }
}

export function calculateDonchianChannels(
  ohlcv: OHLCVData[],
  period: number = 20,
): { breakoutAbove: boolean; breakoutBelow: boolean } {
  if (ohlcv.length < period + 1) {
    return { breakoutAbove: false, breakoutBelow: false }
  }

  const current = ohlcv[ohlcv.length - 1]
  const previous = ohlcv[ohlcv.length - 2]
  const channel = calculatePriceChannel(ohlcv, period)

  const prevChannel = calculatePriceChannel(ohlcv.slice(0, -1), period)

  const breakoutAbove = current.close > prevChannel.upper && previous.close <= prevChannel.upper
  const breakoutBelow = current.close < prevChannel.lower && previous.close >= prevChannel.lower

  return { breakoutAbove, breakoutBelow }
}
