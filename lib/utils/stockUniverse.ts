import { Stock } from '@/types'

export const STOCK_UNIVERSE: Stock[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Technology' },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials' },
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financials' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Financials' },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
  { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
  { ticker: 'LLY', name: 'Eli Lilly', sector: 'Healthcare' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financials' },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples' },
  { ticker: 'HD', name: 'Home Depot', sector: 'Consumer' },
  { ticker: 'MRK', name: 'Merck & Co.', sector: 'Healthcare' },
  { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology' },
  { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer Staples' },
  { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
  { ticker: 'CVX', name: 'Chevron Corp.', sector: 'Energy' },
  { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples' },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Financials' },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Technology' },
  { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { ticker: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples' },
  { ticker: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples' },
  { ticker: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare' },
  { ticker: 'ACN', name: 'Accenture PLC', sector: 'Technology' },
  { ticker: 'MCD', name: "McDonald's Corp.", sector: 'Consumer' },
  { ticker: 'CSCO', name: 'Cisco Systems', sector: 'Technology' },
  { ticker: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare' },
  { ticker: 'DHR', name: 'Danaher Corp.', sector: 'Healthcare' },
  { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
  { ticker: 'WFC', name: 'Wells Fargo', sector: 'Financials' },
  { ticker: 'TXN', name: 'Texas Instruments', sector: 'Technology' },
  { ticker: 'PM', name: 'Philip Morris', sector: 'Consumer Staples' },
  { ticker: 'NEE', name: 'NextEra Energy', sector: 'Utilities' },
  { ticker: 'MS', name: 'Morgan Stanley', sector: 'Financials' },
  { ticker: 'ORCL', name: 'Oracle Corp.', sector: 'Technology' },
  { ticker: 'RTX', name: 'Raytheon Technologies', sector: 'Industrials' },
  { ticker: 'QCOM', name: 'Qualcomm Inc.', sector: 'Technology' },
  { ticker: 'HON', name: 'Honeywell International', sector: 'Industrials' },
  { ticker: 'GE', name: 'GE Aerospace', sector: 'Industrials' },
  { ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials' },
  { ticker: 'SPGI', name: 'S&P Global Inc.', sector: 'Financials' },
  { ticker: 'BLK', name: 'BlackRock Inc.', sector: 'Financials' },
  { ticker: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare' },
]

export const TOP_10_TIER_1 = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'JPM', 'V', 'UNH']

export const TIER_2 = STOCK_UNIVERSE.filter(s => !TOP_10_TIER_1.includes(s.ticker)).map(s => s.ticker)

export const SECTORS = [...new Set(STOCK_UNIVERSE.map(s => s.sector))]

export const STOCK_MAP: Record<string, Stock> = STOCK_UNIVERSE.reduce((acc, stock) => {
  acc[stock.ticker] = stock
  return acc
}, {} as Record<string, Stock>)
