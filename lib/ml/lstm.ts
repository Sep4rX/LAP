// LSTM-like neural network for stock prediction
export interface LSTMPrediction {
  direction: 'Up' | 'Down' | 'Flat'
  confidence: number
}

export class LSTMPredictor {
  private lookback: number
  private weights: {
    input: number[][]
    hidden: number[][]
    output: number[]
  }

  constructor(lookback: number = 60) {
    this.lookback = lookback
    this.weights = {
      input: this.initializeMatrix(lookback, 32),
      hidden: this.initializeMatrix(32, 16),
      output: this.initializeArray(16),
    }
  }

  private initializeMatrix(rows: number, cols: number): number[][] {
    return Array(rows)
      .fill(0)
      .map(() =>
        Array(cols)
          .fill(0)
          .map(() => Math.random() * 0.1 - 0.05),
      )
  }

  private initializeArray(length: number): number[] {
    return Array(length)
      .fill(0)
      .map(() => Math.random() * 0.1 - 0.05)
  }

  predict(ohlcv: Array<{ close: number }>): LSTMPrediction {
    if (ohlcv.length < this.lookback) {
      return { direction: 'Flat', confidence: 0.5 }
    }

    const input = ohlcv.slice(-this.lookback)
    const normalized = this.normalizeData(input.map(d => d.close))

    // Forward pass
    const hiddenActivations = this.relu(this.matrixVectorMult(normalized, this.weights.input))
    const outputActivations = this.softmax(this.vectorVectorMult(hiddenActivations, this.weights.output))

    // Output: [Down, Flat, Up]
    const predictions = outputActivations
    const direction = predictions[0] > predictions[2] ? 'Down' : predictions[2] > predictions[1] ? 'Up' : 'Flat'
    const confidence = Math.max(...predictions)

    return { direction, confidence }
  }

  private normalizeData(data: number[]): number[] {
    const mean = data.reduce((a, b) => a + b) / data.length
    const std = Math.sqrt(data.reduce((a, d) => a + Math.pow(d - mean, 2)) / data.length)
    return data.map(d => (d - mean) / (std + 1e-8))
  }

  private relu(arr: number[]): number[] {
    return arr.map(x => Math.max(0, x))
  }

  private softmax(arr: number[]): number[] {
    const maxVal = Math.max(...arr)
    const exp = arr.map(x => Math.exp(x - maxVal))
    const sum = exp.reduce((a, b) => a + b)
    return exp.map(x => x / sum)
  }

  private matrixVectorMult(vector: number[], matrix: number[][]): number[] {
    return matrix[0]
      .map((_, j) =>
        Array(vector.length)
          .fill(0)
          .reduce((sum, _, i) => sum + vector[i] * matrix[i][j], 0),
      )
  }

  private vectorVectorMult(v1: number[], v2: number[]): number[] {
    const dim = Math.min(v1.length, v2.length)
    const result: number[] = [0, 0, 0]
    for (let i = 0; i < dim; i++) {
      result[i % 3] += v1[i] * v2[i]
    }
    return result
  }
}
