// Hidden Markov Model for stock price prediction
export interface HMMState {
  returns: number[]
  volatility: number
  probability: number
}

export interface HMMPrediction {
  direction: 'Up' | 'Down' | 'Flat'
  confidence: number
  state: number
}

export class HiddenMarkovModel {
  private states: number
  private observations: number[]
  private transitions: number[][]
  private emissions: number[][]
  private priors: number[]

  constructor(states: number = 6) {
    this.states = states
    this.observations = []
    this.transitions = Array(states)
      .fill(0)
      .map(() => Array(states).fill(1 / states))
    this.emissions = Array(states)
      .fill(0)
      .map(() => [0.5, 0.5]) // Up vs Down
    this.priors = Array(states).fill(1 / states)
  }

  fit(returns: number[]): void {
    this.observations = returns

    // Simplified Baum-Welch
    const T = returns.length
    const N = this.states

    for (let iter = 0; iter < 10; iter++) {
      // Forward pass
      const alpha = Array(T)
        .fill(0)
        .map(() => Array(N).fill(0))

      for (let i = 0; i < N; i++) {
        alpha[0][i] = this.priors[i] * this.emissionProb(returns[0], i)
      }

      for (let t = 1; t < T; t++) {
        for (let j = 0; j < N; j++) {
          let sum = 0
          for (let i = 0; i < N; i++) {
            sum += alpha[t - 1][i] * this.transitions[i][j]
          }
          alpha[t][j] = sum * this.emissionProb(returns[t], j)
        }
      }

      // Backward pass
      const beta = Array(T)
        .fill(0)
        .map(() => Array(N).fill(1))

      for (let t = T - 2; t >= 0; t--) {
        for (let i = 0; i < N; i++) {
          let sum = 0
          for (let j = 0; j < N; j++) {
            sum += this.transitions[i][j] * this.emissionProb(returns[t + 1], j) * beta[t + 1][j]
          }
          beta[t][i] = sum
        }
      }

      // Update transitions
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          let num = 0
          for (let t = 0; t < T - 1; t++) {
            num +=
              (alpha[t][i] * this.transitions[i][j] * this.emissionProb(returns[t + 1], j) * beta[t + 1][j]) /
              (alpha[T - 1].reduce((a, b) => a + b))
          }
          this.transitions[i][j] = num / (T - 1)
        }
      }
    }
  }

  private emissionProb(observation: number, state: number): number {
    const mean = -0.001 + (state / this.states) * 0.002
    const variance = 0.0001
    const exponent = -Math.pow(observation - mean, 2) / (2 * variance)
    return Math.exp(exponent) / Math.sqrt(2 * Math.PI * variance)
  }

  predict(returns: number[]): HMMPrediction {
    if (returns.length === 0) {
      return { direction: 'Flat', confidence: 0.5, state: 0 }
    }

    // Viterbi algorithm
    const T = returns.length
    const N = this.states

    const viterbi = Array(T)
      .fill(0)
      .map(() => Array(N).fill(0))
    const path = Array(T)
      .fill(0)
      .map(() => Array(N).fill(0))

    // Initialize
    for (let i = 0; i < N; i++) {
      viterbi[0][i] = Math.log(this.priors[i]) + Math.log(this.emissionProb(returns[0], i) + 1e-10)
    }

    // Forward
    for (let t = 1; t < T; t++) {
      for (let j = 0; j < N; j++) {
        let maxVal = -Infinity
        let maxIdx = 0
        for (let i = 0; i < N; i++) {
          const val = viterbi[t - 1][i] + Math.log(this.transitions[i][j] + 1e-10)
          if (val > maxVal) {
            maxVal = val
            maxIdx = i
          }
        }
        viterbi[t][j] = maxVal + Math.log(this.emissionProb(returns[t], j) + 1e-10)
        path[t][j] = maxIdx
      }
    }

    // Backtrack
    let state = 0
    let maxVal = -Infinity
    for (let i = 0; i < N; i++) {
      if (viterbi[T - 1][i] > maxVal) {
        maxVal = viterbi[T - 1][i]
        state = i
      }
    }

    const statePosition = state / N // 0 to 1
    let direction: 'Up' | 'Down' | 'Flat' = 'Flat'
    if (statePosition > 0.6) {
      direction = 'Up'
    } else if (statePosition < 0.4) {
      direction = 'Down'
    }

    const confidence = Math.abs(statePosition - 0.5) * 2 * 0.7 + 0.3

    return { direction, confidence, state }
  }
}
