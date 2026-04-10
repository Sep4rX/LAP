export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`
  }
  return num.toFixed(0)
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function getDaysSince(timestamp: number): number {
  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
}

export function getColorForPercent(percent: number): string {
  if (percent > 0) return '#00ff88'
  if (percent < 0) return '#ff3b5c'
  return '#6b7280'
}

export function getColorForValue(value: number, threshold: number = 0): string {
  if (value > threshold) return '#00ff88'
  if (value < threshold) return '#ff3b5c'
  return '#6b7280'
}
