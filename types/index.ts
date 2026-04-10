export interface Stock {
  ticker: string
  name: string
  sector: string
}

export interface QuoteData {
  ticker: string
  price: number
  change: number
  changePercent: number
  timestamp: number
  volume?: number
  high?: number
  low?: number
  open?: number
  close?: number
}

export interface OHLCVData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TechnicalIndicators {
  rsi?: number
  macd?: {
    macd: number
    signal: number
    histogram: number
  }
  bollingerBands?: {
    upper: number
    middle: number
    lower: number
  }
  atr?: number
  adx?: number
  obv?: number
  ema?: number
  sma?: number
}

export interface PredictionResult {
  ticker: string
  direction: 'Up' | 'Down' | 'Flat'
  confidence: number
  priceTarget?: number
  riskPercentile: number
  modelBreakdown: {
    hmm: { direction: string; confidence: number }
    lstm: { direction: string; confidence: number }
    randomForest: { direction: string; confidence: number }
    garch: { volatility: number; var95: number; var99: number }
    sentiment: { score: number; strength: number }
  }
  signal: string
  riskBadge: 'Low' | 'Medium' | 'High'
}

export interface MacroData {
  vix: number
  fedRate: number
  yieldCurve: number
  cpi: number
  unemployment: number
  gdp: number
  regime: 'Risk-On' | 'Risk-Off' | 'Neutral'
  timestamp: number
}

export interface NewsItem {
  ticker: string
  headline: string
  description: string
  url: string
  source: string
  timestamp: number
  sentiment?: number
}

export interface InsiderActivity {
  ticker: string
  sentiment: number
  mspr: number
  change: number
}

export interface SignalData {
  ticker: string
  name: string
  sector: string
  price: number
  change: number
  changePercent: number
  prediction: PredictionResult
  confidence: number
  risk: number
  volatility: number
}

export interface BacktestResult {
  period: '1M' | '3M' | '6M' | '1Y'
  initialCapital: number
  finalCapital: number
  totalReturn: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  trades: Array<{
    entryDate: number
    exitDate: number
    entryPrice: number
    exitPrice: number
    return: number
    side: 'long' | 'short'
  }>
}

export interface CacheConfig {
  quotes: number
  ohlcv: number
  indicators: number
  fundamentals: number
  macro: number
  news: number
  insider: number
}

export interface StoreState {
  selectedTicker: string | null
  setSelectedTicker: (ticker: string) => void
  watchlist: string[]
  addToWatchlist: (ticker: string) => void
  removeFromWatchlist: (ticker: string) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
  alerts: Array<{ id: string; message: string; type: string; ticker?: string }>
  addAlert: (message: string, type: string, ticker?: string) => void
  removeAlert: (id: string) => void
}
