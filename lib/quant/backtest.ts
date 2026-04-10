import { OHLCVData } from '@/types'

export interface BacktestTrade {
  entryDate: number
  exitDate: number
  entryPrice: number
  exitPrice: number
  return: number
  side: 'long' | 'short'
}

export interface BacktestStats {
  initialCapital: number
  finalCapital: number
  totalReturn: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  trades: BacktestTrade[]
}

export function calculateReturns(prices: number[]): number[] {
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }
  return returns
}

export function calculateEquityCurve(
  ohlcv: OHLCVData[],
  signals: boolean[],
): number[] {
  const equity: number[] = [100] // Start with $100
  let position = false
  let entryPrice = 0

  for (let i = 0; i < ohlcv.length; i++) {
    if (signals[i] && !position) {
      // Buy signal
      position = true
      entryPrice = ohlcv[i].close
    } else if (!signals[i] && position) {
      // Sell signal
      const returnOnTrade = (ohlcv[i].close - entryPrice) / entryPrice
      equity.push(equity[equity.length - 1] * (1 + returnOnTrade))
      position = false
    } else if (position) {
      // Hold position
      const currentReturn = (ohlcv[i].close - entryPrice) / entryPrice
      equity.push(equity[equity.length - 1] * (1 + currentReturn))
    } else {
      // No position
      equity.push(equity[equity.length - 1])
    }
  }

  return equity
}

export function backtest(
  ohlcv: OHLCVData[],
  signals: boolean[],
  initialCapital: number = 100000,
): BacktestStats {
  const trades: BacktestTrade[] = []
  let capital = initialCapital
  let position = false
  let entryPrice = 0
  let entryTime = 0
  const prices = ohlcv.map(d => d.close)
  const equity: number[] = [capital]

  for (let i = 0; i < Math.min(ohlcv.length, signals.length); i++) {
    if (signals[i] && !position) {
      position = true
      entryPrice = prices[i]
      entryTime = ohlcv[i].timestamp
    } else if (!signals[i] && position) {
      const exitPrice = prices[i]
      const exitTime = ohlcv[i].timestamp
      const returnOnTrade = (exitPrice - entryPrice) / entryPrice
      capital *= 1 + returnOnTrade
      trades.push({
        entryDate: entryTime,
        exitDate: exitTime,
        entryPrice,
        exitPrice,
        return: returnOnTrade,
        side: 'long',
      })
      position = false
    }

    if (position) {
      const currentReturn = (prices[i] - entryPrice) / entryPrice
      equity.push(capital * (1 + currentReturn))
    } else {
      equity.push(capital)
    }
  }

  const totalReturn = (capital - initialCapital) / initialCapital
  const returns = calculateReturns(equity)

  let sharpeRatio = 0
  if (returns.length > 0) {
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance =
      returns.reduce((a, r) => a + Math.pow(r - mean, 2), 0) / returns.length
    const std = Math.sqrt(variance)
    if (std > 0) {
      sharpeRatio = (mean * 252) / std
    }
  }

  let maxDrawdown = 0
  let maxCapital = initialCapital
  for (const cap of equity) {
    if (cap > maxCapital) maxCapital = cap
    const dd = (maxCapital - cap) / maxCapital
    if (dd > maxDrawdown) maxDrawdown = dd
  }

  const winRate = trades.length === 0 ? 0 : trades.filter(t => t.return > 0).length / trades.length

  return {
    initialCapital,
    finalCapital: capital,
    totalReturn,
    sharpeRatio,
    maxDrawdown,
    winRate,
    trades,
  }
}
