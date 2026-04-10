'use client'

import { COLORS } from '@/lib/utils/constants'
import { Bell, X } from 'lucide-react'

export function AlertsFeed() {
  const alerts = [
    { id: 1, ticker: 'AAPL', message: 'Golden Cross detected on 4H chart', type: 'signal' },
    { id: 2, ticker: 'MSFT', message: 'Strong insider buying activity', type: 'insider' },
    { id: 3, ticker: 'NVDA', message: 'Earnings beat expectations', type: 'news' },
  ]

  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs max-h-60 overflow-y-auto">
      <div className="mb-4 pb-3 border-b border-border flex items-center gap-2">
        <Bell size={16} style={{ color: COLORS.ACCENT }} />
        <span className="text-muted">ALERTS</span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-2 bg-background border border-border rounded flex justify-between items-center hover:bg-border transition"
          >
            <div>
              <div className="flex gap-2 mb-1">
                <span style={{ color: COLORS.ACCENT }} className="font-bold">
                  {alert.ticker}
                </span>
                <span
                  style={{
                    color:
                      alert.type === 'signal'
                        ? COLORS.INFO
                        : alert.type === 'insider'
                          ? COLORS.WARNING
                          : COLORS.ACCENT,
                  }}
                >
                  [{alert.type.toUpperCase()}]
                </span>
              </div>
              <div style={{ color: COLORS.TEXT }} className="text-xs">
                {alert.message}
              </div>
            </div>
            <button className="hover:opacity-70">
              <X size={14} style={{ color: COLORS.MUTED }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
