export const CACHE_TTL = {
  QUOTES: 15, // seconds
  OHLCV: 3600, // 1 hour
  INDICATORS: 3600, // 1 hour
  FUNDAMENTALS: 86400, // 24 hours
  MACRO: 21600, // 6 hours
  NEWS: 1800, // 30 minutes
  INSIDER: 43200, // 12 hours
}

export const API_LIMITS = {
  ALPHA_VANTAGE_DAILY: 25,
  FINNHUB_MINUTE: 60,
}

export const ML_CONFIG = {
  HMM_STATES: 6,
  LSTM_LOOKBACK: 60,
  RF_TREES: 100,
  GARCH_P: 1,
  GARCH_Q: 1,
  ENSEMBLE_WEIGHTS: {
    HMM: 0.25,
    LSTM: 0.25,
    RF: 0.2,
    GARCH: 0.15,
    SENTIMENT: 0.15,
  },
}

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.75,
  MEDIUM: 0.6,
  LOW: 0.4,
}

export const RISK_LEVELS = {
  LOW: 33,
  MEDIUM: 67,
  HIGH: 100,
}

export const COLORS = {
  ACCENT: '#00ff88',
  DANGER: '#ff3b5c',
  WARNING: '#f59e0b',
  INFO: '#38bdf8',
  BG: '#0a0e1a',
  SURFACE: '#111827',
  BORDER: '#1f2937',
  TEXT: '#e2e8f0',
  MUTED: '#6b7280',
}

export const MARKET_HOURS = {
  OPEN: 9 * 60 + 30, // 9:30 AM in minutes
  CLOSE: 16 * 60, // 4:00 PM in minutes
}

export const PAGINATION = {
  STOCKS_PER_PAGE: 50,
  SIGNALS_PER_PAGE: 20,
  NEWS_PER_PAGE: 15,
}
