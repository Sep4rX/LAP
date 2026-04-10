'use client'

import { COLORS } from '@/lib/utils/constants'

export function CorrelationMatrix() {
  const tickers = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN']
  const correlations = [
    [1.0, 0.85, 0.92, 0.88, 0.80],
    [0.85, 1.0, 0.88, 0.90, 0.82],
    [0.92, 0.88, 1.0, 0.87, 0.79],
    [0.88, 0.90, 0.87, 1.0, 0.85],
    [0.80, 0.82, 0.79, 0.85, 1.0],
  ]

  const getCorrelationColor = (value: number) => {
    if (value > 0.8) return COLORS.ACCENT
    if (value > 0.6) return COLORS.WARNING
    return COLORS.MUTED
  }

  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="mb-4 pb-3 border-b border-border">
        <span className="text-muted">CORRELATION MATRIX</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-2 py-2"></th>
              {tickers.map((t) => (
                <th key={t} className="px-2 py-2" style={{ color: COLORS.ACCENT }}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickers.map((ticker, i) => (
              <tr key={ticker}>
                <td className="px-2 py-2 font-bold" style={{ color: COLORS.ACCENT }}>
                  {ticker}
                </td>
                {correlations[i].map((corr, j) => (
                  <td
                    key={`${ticker}-${j}`}
                    className="px-2 py-2 text-center"
                    style={{ color: getCorrelationColor(corr) }}
                  >
                    {corr.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
