'use client'

import { COLORS } from '@/lib/utils/constants'

export function EarningsCalendar() {
  const earnings = [
    { ticker: 'AAPL', date: '2024-04-15', time: '16:00 EST', epsEst: 1.24, beat: true },
    { ticker: 'MSFT', date: '2024-04-18', time: '16:30 EST', epsEst: 3.10, beat: false },
    { ticker: 'NVDA', date: '2024-04-22', time: '17:00 EST', epsEst: 5.28, beat: true },
  ]

  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="pb-4 border-b border-border mb-4">
        <span className="text-muted">EARNINGS CALENDAR</span>
      </div>

      <div className="space-y-2">
        {earnings.map((e) => (
          <div key={e.ticker} className="p-3 bg-background border border-border rounded flex justify-between items-start">
            <div>
              <div style={{ color: COLORS.ACCENT }} className="font-bold">
                {e.ticker}
              </div>
              <div className="text-muted text-xs">{e.date} @ {e.time}</div>
            </div>
            <div className="text-right">
              <div style={{ color: e.beat ? COLORS.ACCENT : COLORS.DANGER }}>
                {e.beat ? '📈 BEAT' : '📉 MISS'}
              </div>
              <div className="text-muted text-xs">Est: ${e.epsEst}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
