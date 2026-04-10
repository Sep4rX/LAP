'use client'

import { MacroData } from '@/types'
import { COLORS } from '@/lib/utils/constants'

interface MacroPanelProps {
  macro: MacroData | undefined
  isLoading?: boolean
}

export function MacroPanel({ macro, isLoading }: MacroPanelProps) {
  if (isLoading || !macro) {
    return (
      <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
        <div className="text-center text-muted">
          {isLoading ? 'Loading macro data...' : 'No macro data'}
        </div>
      </div>
    )
  }

  const getRegimeColor = (regime: string) => {
    if (regime === 'Risk-On') return COLORS.ACCENT
    if (regime === 'Risk-Off') return COLORS.DANGER
    return COLORS.WARNING
  }

  return (
    <div className="space-y-3 p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
        <span className="text-muted">MACRO INDICATORS</span>
        <span style={{ color: getRegimeColor(macro.regime) }} className="font-bold">
          {macro.regime}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-muted mb-1">VIX</div>
          <div style={{ color: macro.vix > 20 ? COLORS.DANGER : COLORS.ACCENT }}>
            {macro.vix.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">Fed Rate</div>
          <div style={{ color: COLORS.INFO }}>
            {macro.fedRate.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">Yield Curve</div>
          <div style={{ color: macro.yieldCurve > 0 ? COLORS.ACCENT : COLORS.DANGER }}>
            {macro.yieldCurve.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">CPI</div>
          <div style={{ color: COLORS.WARNING }}>
            {macro.cpi.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">Unemployment</div>
          <div style={{ color: COLORS.INFO }}>
            {macro.unemployment.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">GDP</div>
          <div style={{ color: COLORS.ACCENT }}>
            {macro.gdp.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
}
