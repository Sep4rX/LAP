'use client'

import { PredictionResult } from '@/types'
import { cn } from '@/lib/utils/cn'
import { COLORS } from '@/lib/utils/constants'

interface PredictionPanelProps {
  prediction: PredictionResult | undefined
  isLoading?: boolean
}

export function PredictionPanel({ prediction, isLoading }: PredictionPanelProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-surface border border-border rounded font-mono">
        <div className="text-center text-muted">Loading predictions...</div>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="p-6 bg-surface border border-border rounded font-mono">
        <div className="text-center text-muted">No prediction data</div>
      </div>
    )
  }

  const getDirectionColor = (direction: string) => {
    if (direction === 'Up') return COLORS.ACCENT
    if (direction === 'Down') return COLORS.DANGER
    return COLORS.MUTED
  }

  const getSignalColor = (signal: string) => {
    if (signal.includes('Buy')) return COLORS.ACCENT
    if (signal.includes('Sell')) return COLORS.DANGER
    return COLORS.WARNING
  }

  return (
    <div className="space-y-4 p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
        <span className="text-muted">ENSEMBLE PREDICTION</span>
        <span
          style={{ color: getDirectionColor(prediction.direction) }}
          className="text-sm font-bold"
        >
          {prediction.direction}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted mb-1">Confidence</div>
          <div style={{ color: COLORS.ACCENT }}>
            {(prediction.confidence * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">Signal</div>
          <div style={{ color: getSignalColor(prediction.signal) }}>
            {prediction.signal}
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">Risk</div>
          <div style={{ color: prediction.riskBadge === 'High' ? COLORS.DANGER : COLORS.ACCENT }}>
            {prediction.riskBadge}
          </div>
        </div>
        <div>
          <div className="text-muted mb-1">Risk %ile</div>
          <div style={{ color: COLORS.INFO }}>
            {prediction.riskPercentile.toFixed(0)}
          </div>
        </div>
      </div>

      {prediction.priceTarget && (
        <div className="pt-4 border-t border-border">
          <div className="text-muted mb-1">Price Target</div>
          <div style={{ color: COLORS.ACCENT }} className="text-lg">
            ${prediction.priceTarget.toFixed(2)}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <div className="text-muted mb-3">MODEL BREAKDOWN</div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>HMM:</span>
            <span style={{ color: getDirectionColor(prediction.modelBreakdown.hmm.direction) }}>
              {prediction.modelBreakdown.hmm.direction} ({(prediction.modelBreakdown.hmm.confidence * 100).toFixed(0)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>LSTM:</span>
            <span style={{ color: getDirectionColor(prediction.modelBreakdown.lstm.direction) }}>
              {prediction.modelBreakdown.lstm.direction} ({(prediction.modelBreakdown.lstm.confidence * 100).toFixed(0)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>Random Forest:</span>
            <span style={{ color: getDirectionColor(prediction.modelBreakdown.randomForest.direction) }}>
              {prediction.modelBreakdown.randomForest.direction} ({(prediction.modelBreakdown.randomForest.confidence * 100).toFixed(0)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>GARCH Vol:</span>
            <span style={{ color: COLORS.INFO }}>
              {(prediction.modelBreakdown.garch.volatility * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Sentiment:</span>
            <span style={{ color: getDirectionColor(prediction.modelBreakdown.sentiment.score > 0 ? 'Up' : 'Down') }}>
              {prediction.modelBreakdown.sentiment.score.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
