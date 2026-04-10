'use client'

import { useEffect, useRef } from 'react'
import { OHLCVData } from '@/types'
import { COLORS } from '@/lib/utils/constants'

interface CandlestickChartProps {
  data: OHLCVData[]
  width?: number
  height?: number
}

export function CandlestickChart({
  data,
  width = 800,
  height = 400,
}: CandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = COLORS.BG
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = COLORS.BORDER
    ctx.lineWidth = 1

    // Get price range
    const prices = data.flatMap(d => [d.high, d.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice || 1

    // Draw candlesticks
    const candleWidth = Math.max(2, (width - 40) / data.length)
    const padding = 30

    data.forEach((candle, index) => {
      const x = padding + index * candleWidth + candleWidth / 2
      const yHigh = height - padding - ((candle.high - minPrice) / priceRange) * (height - padding * 2)
      const yClose = height - padding - ((candle.close - minPrice) / priceRange) * (height - padding * 2)
      const yOpen = height - padding - ((candle.open - minPrice) / priceRange) * (height - padding * 2)
      const yLow = height - padding - ((candle.low - minPrice) / priceRange) * (height - padding * 2)

      // Draw wick
      ctx.strokeStyle = COLORS.MUTED
      ctx.beginPath()
      ctx.moveTo(x, yHigh)
      ctx.lineTo(x, yLow)
      ctx.stroke()

      // Draw candle body
      const isUp = candle.close >= candle.open
      ctx.fillStyle = isUp ? COLORS.ACCENT : COLORS.DANGER
      const bodyTop = Math.min(yOpen, yClose)
      const bodyHeight = Math.abs(yClose - yOpen) || 2

      ctx.fillRect(x - candleWidth / 3, bodyTop, (candleWidth * 2) / 3, bodyHeight)
    })

    // Draw axes
    ctx.strokeStyle = COLORS.BORDER
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width, height - padding)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()
  }, [data, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full border border-border rounded"
      style={{ backgroundColor: COLORS.BG }}
    />
  )
}
