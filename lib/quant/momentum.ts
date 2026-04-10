import { OHLCVData } from '@/types'

export function calculateMomentum(closes: number[], period: number = 10): number {
  if (closes.length < period) return 0
  return closes[closes.length - 1] - closes[closes.length - period - 1]
}

export function calculateROC(closes: number[], period: number = 12): number {
  if (closes.length < period) return 0
  const prevClose = closes[closes.length - period - 1]
  if (prevClose === 0) return 0
  return ((closes[closes.length - 1] - prevClose) / prevClose) * 100
}

export function calculateStochastic(
  ohlcv: OHLCVData[],
  period: number = 14,
): { k: number; d: number } | null {
  if (ohlcv.length < period) return null

  const recentOHLCV = ohlcv.slice(-period)
  const highest = Math.max(...recentOHLCV.map(d => d.high))
  const lowest = Math.min(...recentOHLCV.map(d => d.low))
  const close = ohlcv[ohlcv.length - 1].close

  if (highest === lowest) {
    return { k: 50, d: 50 }
  }

  const k = ((close - lowest) / (highest - lowest)) * 100

  // Simplified D (3-period SMA of K)
  const kValues = []
  for (let i = Math.max(0, ohlcv.length - period - 3); i < ohlcv.length; i++) {
    const obs = ohlcv.slice(Math.max(0, i - period + 1), i + 1)
    if (obs.length === period) {
      const h = Math.max(...obs.map(d => d.high))
      const l = Math.min(...obs.map(d => d.low))
      const c = obs[obs.length - 1].close
      kValues.push(((c - l) / (h - l)) * 100)
    }
  }

  const d = kValues.slice(-3).reduce((a, b) => a + b, 0) / 3

  return { k, d }
}

export function calculateCCI(ohlcv: OHLCVData[], period: number = 20): number {
  if (ohlcv.length < period) return 0

  const recentOHLCV = ohlcv.slice(-period)
  const typicalPrices = recentOHLCV.map(d => (d.high + d.low + d.close) / 3)
  const sma = typicalPrices.reduce((a, b) => a + b, 0) / period
  const meanDeviation =
    typicalPrices.reduce((a, p) => a + Math.abs(p - sma), 0) / period
  const cci = (typicalPrices[typicalPrices.length - 1] - sma) / (0.015 * meanDeviation)

  return cci
}

export function calculateWilliamsR(
  ohlcv: OHLCVData[],
  period: number = 14,
): number {
  if (ohlcv.length < period) return 0

  const recentOHLCV = ohlcv.slice(-period)
  const highest = Math.max(...recentOHLCV.map(d => d.high))
  const lowest = Math.min(...recentOHLCV.map(d => d.low))
  const close = ohlcv[ohlcv.length - 1].close

  if (highest === lowest) return 0
  return (((highest - close) / (highest - lowest)) * -100)
}
