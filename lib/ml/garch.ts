// GARCH model for volatility forecasting
export interface GARCHPrediction {
  volatility: number
  var95: number
  var99: number
}

export class GARCHModel {
  private omega: number = 0.00001
  private alpha: number = 0.1
  private beta: number = 0.85

  fit(returns: number[]): void {
    if (returns.length < 2) return

    // Simplified parameter estimation
    const variance = returns.reduce((a, r) => a + Math.pow(r, 2), 0) / returns.length
    this.omega = variance * (1 - this.alpha - this.beta)
  }

  predict(returns: number[]): GARCHPrediction {
    if (returns.length === 0) {
      return { volatility: 0.01, var95: 0.025, var99: 0.035 }
    }

    // Calculate conditional variance (GARCH(1,1))
    const recentReturn = returns[returns.length - 1]
    const recentVariance = Math.pow(recentReturn, 2)

    let prevVariance = 0
    if (returns.length > 1) {
      prevVariance = Math.pow(returns[returns.length - 2], 2)
    }

    const conditionalVariance = this.omega + this.alpha * recentVariance + this.beta * prevVariance

    const volatility = Math.sqrt(Math.max(conditionalVariance, 0))

    // Value at Risk calculations (assuming normal distribution)
    const zscore95 = 1.645
    const zscore99 = 2.326

    const var95 = -zscore95 * volatility
    const var99 = -zscore99 * volatility

    return {
      volatility,
      var95: Math.abs(var95),
      var99: Math.abs(var99),
    }
  }

  forecastVolatility(returns: number[], periods: number = 10): number[] {
    const forecasts: number[] = []

    let variance = 0
    if (returns.length > 0) {
      variance = returns.reduce((a, r) => a + Math.pow(r, 2), 0) / returns.length
    }

    for (let i = 0; i < periods; i++) {
      variance = this.omega + this.alpha * Math.pow(returns[returns.length - 1] || 0, 2) + this.beta * variance
      forecasts.push(Math.sqrt(Math.max(variance, 0)))
    }

    return forecasts
  }
}
