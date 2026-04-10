'use client'

import { COLORS } from '@/lib/utils/constants'
import { Activity, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react'

export function SignalTable() {
  const signals = [
    { ticker: 'AAPL', signal: 'Buy', confidence: 0.8, risk: 'Low' },
    { ticker: 'MSFT', signal: 'Hold', confidence: 0.6, risk: 'Medium' },
    { ticker: 'NVDA', signal: 'Sell', confidence: 0.75, risk: 'High' },
  ]

  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="mb-4 pb-3 border-b border-border">
        <span className="text-muted">SIGNALS — TOP 50</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left pb-2 px-2" style={{ color: COLORS.ACCENT }}>Ticker</th>
              <th className="text-left pb-2 px-2" style={{ color: COLORS.ACCENT }}>Signal</th>
              <th className="text-left pb-2 px-2" style={{ color: COLORS.ACCENT }}>Confidence</th>
              <th className="text-left pb-2 px-2" style={{ color: COLORS.ACCENT }}>Risk</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((row) => (
              <tr key={row.ticker} className="border-b border-border hover:bg-background cursor-pointer">
                <td className="py-2 px-2 font-bold" style={{ color: COLORS.ACCENT }}>
                  {row.ticker}
                </td>
                <td className="py-2 px-2" style={{ color: row.signal === 'Buy' ? COLORS.ACCENT : row.signal === 'Sell' ? COLORS.DANGER : COLORS.WARNING }}>
                  {row.signal}
                </td>
                <td className="py-2 px-2">{(row.confidence * 100).toFixed(0)}%</td>
                <td className="py-2 px-2" style={{ color: row.risk === 'High' ? COLORS.DANGER : row.risk === 'Low' ? COLORS.ACCENT : COLORS.WARNING }}>
                  {row.risk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
