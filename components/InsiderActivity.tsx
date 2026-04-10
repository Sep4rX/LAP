'use client'

import { COLORS } from '@/lib/utils/constants'

export function InsiderActivity() {
  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="pb-4 border-b border-border mb-4">
        <span className="text-muted">INSIDER ACTIVITY</span>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-background border border-border rounded">
          <div className="flex justify-between mb-2">
            <span style={{ color: COLORS.ACCENT }} className="font-bold">
              CEO
            </span>
            <span style={{ color: COLORS.ACCENT }}>BUY</span>
          </div>
          <div className="text-muted text-xs">50,000 shares @ $189.20</div>
          <div className="text-muted text-xs">3 days ago</div>
        </div>

        <div className="p-3 bg-background border border-border rounded">
          <div className="flex justify-between mb-2">
            <span style={{ color: COLORS.ACCENT }} className="font-bold">
              CFO
            </span>
            <span style={{ color: COLORS.ACCENT }}>BUY</span>
          </div>
          <div className="text-muted text-xs">25,000 shares @ $188.50</div>
          <div className="text-muted text-xs">1 week ago</div>
        </div>

        <div className="p-3 bg-background border border-border rounded">
          <div className="flex justify-between mb-2">
            <span style={{ color: COLORS.ACCENT }} className="font-bold">
              Director
            </span>
            <span style={{ color: COLORS.DANGER }}>SELL</span>
          </div>
          <div className="text-muted text-xs">10,000 shares @ $191.30</div>
          <div className="text-muted text-xs">2 weeks ago</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-muted mb-2">Insider Sentiment</div>
        <div style={{ color: COLORS.ACCENT }} className="text-lg font-bold">
          +0.73
        </div>
      </div>
    </div>
  )
}
