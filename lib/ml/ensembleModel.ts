import { OHLCVData, TechnicalIndicators, PredictionResult } from '@/types'
import { HiddenMarkovModel } from '@/lib/ml/hmm'
import { LSTMPredictor } from '@/lib/ml/lstm'
import { RandomForest } from '@/lib/ml/randomForest'
import { GARCHModel } from '@/lib/ml/garch'
import { SentimentAnalyzer } from '@/lib/ml/sentiment'
import { ML_CONFIG } from '@/lib/utils/constants'
import { getIndicators } from '@/lib/quant/indicators'

export class EnsembleModel {
  private hmm: HiddenMarkovModel
  private lstm: LSTMPredictor
  private rf: RandomForest
  private garch: GARCHModel
  private sentiment: SentimentAnalyzer

  constructor() {
    this.hmm = new HiddenMarkovModel(ML_CONFIG.HMM_STATES)
    this.lstm = new LSTMPredictor(ML_CONFIG.LSTM_LOOKBACK)
    this.rf = new RandomForest()
    this.garch = new GARCHModel()
    this.sentiment = new SentimentAnalyzer()
  }

  predict(
    ticker: string,
    ohlcv: OHLCVData[],
    headlines: string[] = [],
  ): PredictionResult {
    if (ohlcv.length === 0) {
      return this.getDefaultPrediction(ticker)
    }

    // Get technical indicators
    const indicators = getIndicators(ohlcv)

    // Extract returns for HMM
    const returns: number[] = []
    for (let i = 1; i < ohlcv.length; i++) {
      returns.push((ohlcv[i].close - ohlcv[i - 1].close) / ohlcv[i - 1].close)
    }

    // Train HMM
    this.hmm.fit(returns)
    const hmmPred = this.hmm.predict(returns)

    // LSTM prediction
    const lstmPred = this.lstm.predict(ohlcv)

    // Random Forest prediction
    const featureVector = {
      rsi: indicators.rsi || 50,
      macd: indicators.macd?.macd || 0,
      bb: indicators.bollingerBands?.middle || 0,
      atr: indicators.atr || 0,
      adx: indicators.adx || 0,
      obv: indicators.obv || 0,
    }

    // Train with dummy data for RF
    const featureHistory = Array(20)
      .fill(featureVector)
      .map((f, i) => ({
        ...f,
        rsi: f.rsi + (Math.random() - 0.5) * 10,
      }))
    const labels = Array(20).fill(0).map((_, i) => (i % 3 === 0 ? 'Up' : i % 3 === 1 ? 'Down' : 'Flat'))
    this.rf.train(featureHistory, labels as Array<'Up' | 'Down' | 'Flat'>)
    const rfPred = this.rf.predict(featureVector)

    // GARCH prediction
    this.garch.fit(returns)
    const garchPred = this.garch.predict(returns)

    // Sentiment analysis
    const sentimentScore = this.sentiment.batchAnalyze(headlines)

    // Ensemble weighted voting
    const weights = ML_CONFIG.ENSEMBLE_WEIGHTS
    const directionScores = {
      Up:
        (hmmPred.direction === 'Up' ? 1 : hmmPred.direction === 'Flat' ? 0.5 : 0) * weights.HMM +
        (lstmPred.direction === 'Up' ? 1 : lstmPred.direction === 'Flat' ? 0.5 : 0) * weights.LSTM +
        (rfPred.direction === 'Up' ? 1 : rfPred.direction === 'Flat' ? 0.5 : 0) * weights.RF +
        (sentimentScore > 0.1 ? 0.7 : 0.3) * weights.SENTIMENT +
        (garchPred.volatility < 0.015 ? 0.6 : 0.4) * weights.GARCH,
      Down:
        (hmmPred.direction === 'Down' ? 1 : hmmPred.direction === 'Flat' ? 0.5 : 0) * weights.HMM +
        (lstmPred.direction === 'Down' ? 1 : lstmPred.direction === 'Flat' ? 0.5 : 0) * weights.LSTM +
        (rfPred.direction === 'Down' ? 1 : rfPred.direction === 'Flat' ? 0.5 : 0) * weights.RF +
        (sentimentScore < -0.1 ? 0.7 : 0.3) * weights.SENTIMENT +
        (garchPred.volatility > 0.02 ? 0.6 : 0.4) * weights.GARCH,
      Flat:
        (hmmPred.direction === 'Flat' ? 1 : 0.5) * weights.HMM +
        (lstmPred.direction === 'Flat' ? 1 : 0.5) * weights.LSTM +
        (rfPred.direction === 'Flat' ? 1 : 0.5) * weights.RF +
        (Math.abs(sentimentScore) < 0.1 ? 0.7 : 0.3) * weights.SENTIMENT +
        (0.015 >= garchPred.volatility && garchPred.volatility >= 0.02 ? 0.6 : 0.4) * weights.GARCH,
    }

    const total = directionScores.Up + directionScores.Down + directionScores.Flat
    const upProb = directionScores.Up / total
    const downProb = directionScores.Down / total
    const flatProb = directionScores.Flat / total

    let direction: 'Up' | 'Down' | 'Flat' = 'Flat'
    let confidence = flatProb

    if (upProb > downProb && upProb > flatProb) {
      direction = 'Up'
      confidence = upProb
    } else if (downProb > upProb && downProb > flatProb) {
      direction = 'Down'
      confidence = downProb
    }

    // Calculate price target
    const currentPrice = ohlcv[ohlcv.length - 1].close
    const atr = indicators.atr || currentPrice * 0.02
    const priceTarget = direction === 'Up' ? currentPrice + atr * 2 : direction === 'Down' ? currentPrice - atr * 2 : currentPrice

    // Risk calculation
    const volatilityPercentile = Math.min(100, garchPred.volatility * 2000)
    const riskPercentile = Math.max(volatilityPercentile - (confidence * 30), 10)

    const riskBadge = riskPercentile > 66 ? 'High' : riskPercentile > 33 ? 'Medium' : 'Low'

    return {
      ticker,
      direction,
      confidence: Math.min(1, Math.max(0.3, confidence)),
      priceTarget,
      riskPercentile,
      modelBreakdown: {
        hmm: { direction: hmmPred.direction, confidence: hmmPred.confidence },
        lstm: { direction: lstmPred.direction, confidence: lstmPred.confidence },
        randomForest: { direction: rfPred.direction, confidence: rfPred.confidence },
        garch: {
          volatility: garchPred.volatility,
          var95: garchPred.var95,
          var99: garchPred.var99,
        },
        sentiment: {
          score: sentimentScore,
          strength: Math.abs(sentimentScore),
        },
      },
      signal: this.generateSignal(direction, confidence, riskPercentile),
      riskBadge,
    }
  }

  private generateSignal(
    direction: 'Up' | 'Down' | 'Flat',
    confidence: number,
    risk: number,
  ): string {
    if (confidence < 0.5) return 'Neutral'
    if (direction === 'Up' && risk < 50) return 'Buy'
    if (direction === 'Down' && risk < 50) return 'Sell'
    if (direction === 'Up') return 'Cautious Buy'
    if (direction === 'Down') return 'Cautious Sell'
    return 'Hold'
  }

  private getDefaultPrediction(ticker: string): PredictionResult {
    return {
      ticker,
      direction: 'Flat',
      confidence: 0.5,
      priceTarget: 0,
      riskPercentile: 50,
      modelBreakdown: {
        hmm: { direction: 'Flat', confidence: 0.33 },
        lstm: { direction: 'Flat', confidence: 0.33 },
        randomForest: { direction: 'Flat', confidence: 0.33 },
        garch: { volatility: 0.01, var95: 0.02, var99: 0.03 },
        sentiment: { score: 0, strength: 0 },
      },
      signal: 'Neutral',
      riskBadge: 'Medium',
    }
  }
}
