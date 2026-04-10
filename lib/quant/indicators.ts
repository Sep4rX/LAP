import { OHLCVData, TechnicalIndicators } from '@/types'

export function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50

  const deltas = []
  for (let i = 1; i < closes.length; i++) {
    deltas.push(closes[i] - closes[i - 1])
  }

  const gains = deltas.map(d => (d > 0 ? d : 0))
  const losses = deltas.map(d => (d < 0 ? -d : 0))

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period
  }

  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

export function calculateMACD(
  closes: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9,
): { macd: number; signal: number; histogram: number } | null {
  if (closes.length < slowPeriod) return null

  const fastEMA = calculateEMA(closes, fastPeriod)
  const slowEMA = calculateEMA(closes, slowPeriod)
  const macd = fastEMA - slowEMA

  const macdLine = []
  for (let i = slowPeriod - 1; i < closes.length; i++) {
    const f = calculateEMA(closes.slice(0, i + 1), fastPeriod)
    const s = calculateEMA(closes.slice(0, i + 1), slowPeriod)
    macdLine.push(f - s)
  }

  const signal = calculateEMA(macdLine, signalPeriod)
  const histogram = macd - signal

  return { macd, signal, histogram }
}

export function calculateBollingerBands(
  closes: number[],
  period: number = 20,
  stdDev: number = 2,
): { upper: number; middle: number; lower: number } | null {
  if (closes.length < period) return null

  const recentCloses = closes.slice(-period)
  const middle = recentCloses.reduce((a, b) => a + b, 0) / period
  const variance =
    recentCloses.reduce((a, c) => a + Math.pow(c - middle, 2), 0) / period
  const std = Math.sqrt(variance)

  return {
    upper: middle + std * stdDev,
    middle,
    lower: middle - std * stdDev,
  }
}

export function calculateEMA(data: number[], period: number): number {
  if (data.length === 0) return 0
  if (data.length === 1) return data[0]

  const sma = data.slice(0, period).reduce((a, b) => a + b, 0) / period
  const multiplier = 2 / (period + 1)

  let ema = sma
  for (let i = period; i < data.length; i++) {
    ema = data[i] * multiplier + ema * (1 - multiplier)
  }

  return ema
}

export function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return 0
  const recent = data.slice(-period)
  return recent.reduce((a, b) => a + b, 0) / period
}

export function calculateATR(ohlcv: OHLCVData[], period: number = 14): number {
  if (ohlcv.length < period + 1) return 0

  const trueRanges = []
  for (let i = 1; i < ohlcv.length; i++) {
    const high = ohlcv[i].high
    const low = ohlcv[i].low
    const prevClose = ohlcv[i - 1].close
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose),
    )
    trueRanges.push(tr)
  }

  const atr =
    trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period
  return atr
}

export function calculateADX(ohlcv: OHLCVData[], period: number = 14): number {
  if (ohlcv.length < period + 1) return 0

  const dms: { plus: number[]; minus: number[] } = { plus: [], minus: [] }

  for (let i = 1; i < ohlcv.length; i++) {
    const highDiff = ohlcv[i].high - ohlcv[i - 1].high
    const lowDiff = ohlcv[i - 1].low - ohlcv[i].low

    if (highDiff > 0 && highDiff > lowDiff) {
      dms.plus.push(highDiff)
      dms.minus.push(0)
    } else if (lowDiff > 0 && lowDiff > highDiff) {
      dms.plus.push(0)
      dms.minus.push(lowDiff)
    } else {
      dms.plus.push(0)
      dms.minus.push(0)
    }
  }

  const atr = calculateATR(ohlcv, period)
  const plusDI =
    (100 *
      dms.plus.slice(-period).reduce((a, b) => a + b, 0)) /
    (atr * period)
  const minusDI =
    (100 *
      dms.minus.slice(-period).reduce((a, b) => a + b, 0)) /
    (atr * period)

  const di = Math.abs(plusDI - minusDI) / (plusDI + minusDI)
  return Math.min(100, di * 100)
}

export function calculateOBV(ohlcv: OHLCVData[]): number {
  let obv = 0
  for (const bar of ohlcv) {
    if (bar.close > (ohlcv[ohlcv.indexOf(bar) - 1]?.close || 0)) {
      obv += bar.volume
    } else if (bar.close < (ohlcv[ohlcv.indexOf(bar) - 1]?.close || 0)) {
      obv -= bar.volume
    }
  }
  return obv
}

export function getIndicators(ohlcv: OHLCVData[]): TechnicalIndicators {
  if (ohlcv.length === 0) return {}

  const closes = ohlcv.map(d => d.close)

  return {
    rsi: calculateRSI(closes),
    macd: calculateMACD(closes) || undefined,
    bollingerBands: calculateBollingerBands(closes) || undefined,
    atr: calculateATR(ohlcv),
    adx: calculateADX(ohlcv),
    obv: calculateOBV(ohlcv),
    ema: calculateEMA(closes, 12),
    sma: calculateSMA(closes, 20),
  }
}
