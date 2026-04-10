// Sentiment analysis using VADER-like approach
export interface SentimentScore {
  score: number // -1 to +1
  strength: number // 0 to 1
}

export class SentimentAnalyzer {
  private lexicon: Record<string, number> = {
    // Positive words
    bullish: 0.8,
    upside: 0.7,
    strong: 0.6,
    surge: 0.8,
    rally: 0.7,
    gain: 0.6,
    profit: 0.7,
    growth: 0.6,
    momentum: 0.6,
    record: 0.7,
    beat: 0.7,
    outperform: 0.7,
    excellent: 0.8,
    positive: 0.6,
    buy: 0.7,
    upgrade: 0.8,
    emerging: 0.5,
    breakthrough: 0.8,
    innovation: 0.6,

    // Negative words
    bearish: -0.8,
    downside: -0.7,
    weak: -0.6,
    plunge: -0.8,
    decline: -0.7,
    loss: -0.6,
    miss: -0.7,
    underperform: -0.7,
    negative: -0.6,
    sell: -0.7,
    downgrade: -0.8,
    risk: -0.5,
    concern: -0.5,
    warning: -0.6,
    crash: -0.8,
    worse: -0.6,
    fear: -0.6,
    threatened: -0.6,
  }

  analyzeSentiment(text: string): SentimentScore {
    if (!text || text.length === 0) {
      return { score: 0, strength: 0 }
    }

    const words = text.toLowerCase().split(/\s+/)
    let totalScore = 0
    let matchCount = 0

    for (const word of words) {
      const cleanWord = word.replace(/[^\w-]/g, '')
      if (this.lexicon[cleanWord]) {
        totalScore += this.lexicon[cleanWord]
        matchCount++
      }
    }

    if (matchCount === 0) {
      return { score: 0, strength: 0 }
    }

    const avgScore = totalScore / matchCount
    const strength = Math.min(1, matchCount / words.length * 5)

    return {
      score: Math.max(-1, Math.min(1, avgScore)),
      strength,
    }
  }

  batchAnalyze(texts: string[]): number {
    if (texts.length === 0) return 0

    const scores = texts.map(text => {
      const sentiment = this.analyzeSentiment(text)
      return sentiment.score * sentiment.strength
    })

    return scores.reduce((a, b) => a + b, 0) / texts.length
  }
}
