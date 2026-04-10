import { OHLCVData } from '@/types'

export function calculateSharpe(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) return 0

  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance =
    returns.reduce((a, r) => a + Math.pow(r - meanReturn, 2), 0) / returns.length
  const std = Math.sqrt(variance)

  if (std === 0) return 0
  return (meanReturn - riskFreeRate / 252) / std // Annualized
}

export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length === 0) return 0

  let maxPrice = prices[0]
  let maxDrawdown = 0

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i]
    }
    const drawdown = (maxPrice - prices[i]) / maxPrice
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  return maxDrawdown
}

export function calculateCustomDrawdown(prices: number[]): number[] {
  if (prices.length === 0) return []

  const drawdowns: number[] = []
  let maxPrice = prices[0]

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i]
    }
    const drawdown = (maxPrice - prices[i]) / maxPrice
    drawdowns.push(drawdown)
  }

  return drawdowns
}

export function calculateStandardDeviation(
  ohlcv: OHLCVData[],
  period: number = 20,
): number {
  if (ohlcv.length < period) return 0

  const returns = []
  for (let i = 1; i < ohlcv.length; i++) {
    const r = Math.log(ohlcv[i].close / ohlcv[i - 1].close)
    returns.push(r)
  }

  const recentReturns = returns.slice(-period)
  const mean = recentReturns.reduce((a, b) => a + b, 0) / period
  const variance =
    recentReturns.reduce((a, r) => a + Math.pow(r - mean, 2), 0) / period
  return Math.sqrt(variance)
}

export function calculateVaR(
  returns: number[],
  confidence: number = 0.95,
): number {
  if (returns.length === 0) return 0

  const sorted = [...returns].sort((a, b) => a - b)
  const index = Math.floor(sorted.length * (1 - confidence))
  return Math.abs(sorted[index])
}

export function calculateSortino(
  returns: number[],
  targetReturn: number = 0,
  riskFreeRate: number = 0.02,
): number {
  if (returns.length === 0) return 0

  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const downsidevariations = returns
    .filter(r => r < targetReturn)
    .map(r => Math.pow(r - targetReturn, 2))

  if (downsidevariations.length === 0) return 0

  const varianceDownside =
    downsidevariations.reduce((a, b) => a + b, 0) / returns.length
  const downstd = Math.sqrt(varianceDownside)

  if (downstd === 0) return 0
  return (meanReturn - riskFreeRate / 252) / downstd
}

export function calculateCalmarRatio(
  returns: number[],
  prices: number[],
): number {
  if (returns.length === 0 || prices.length === 0) return 0

  const totalReturn = prices[prices.length - 1] / prices[0] - 1
  const maxDD = calculateMaxDrawdown(prices)

  if (maxDD === 0) return 0
  return totalReturn / maxDD
}

export function calculateCorrelation(
  returns1: number[],
  returns2: number[],
): number {
  if (returns1.length === 0 || returns2.length === 0) return 0

  const n = Math.min(returns1.length, returns2.length)
  const r1 = returns1.slice(-n)
  const r2 = returns2.slice(-n)

  const mean1 = r1.reduce((a, b) => a + b, 0) / n
  const mean2 = r2.reduce((a, b) => a + b, 0) / n

  const cov = r1.reduce((a, _, i) => a + (r1[i] - mean1) * (r2[i] - mean2), 0) / n
  const std1 = Math.sqrt(r1.reduce((a, r) => a + Math.pow(r - mean1, 2), 0) / n)
  const std2 = Math.sqrt(r2.reduce((a, r) => a + Math.pow(r - mean2, 2), 0) / n)

  if (std1 === 0 || std2 === 0) return 0
  return cov / (std1 * std2)
}
