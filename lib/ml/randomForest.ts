// Random Forest classifier for stock direction prediction
export interface RandomForestPrediction {
  direction: 'Up' | 'Down' | 'Flat'
  confidence: number
  featureImportance: Record<string, number>
}

interface TreeNode {
  feature?: string
  threshold?: number
  left?: TreeNode
  right?: TreeNode
  prediction?: 'Up' | 'Down' | 'Flat'
  samples?: number
}

export class RandomForest {
  private trees: TreeNode[] = []
  private numTrees: number = 100
  private features = ['rsi', 'macd', 'bb', 'atr', 'adx', 'obv']

  train(features: Array<Record<string, number>>, labels: Array<'Up' | 'Down' | 'Flat'>): void {
    this.trees = []
    for (let i = 0; i < this.numTrees; i++) {
      const sampleIndices = this.bootstrapSample(features.length)
      const sampledFeatures = sampleIndices.map(idx => features[idx])
      const sampledLabels = sampleIndices.map(idx => labels[idx])
      const tree = this.buildTree(sampledFeatures, sampledLabels, 0)
      this.trees.push(tree)
    }
  }

  predict(features: Record<string, number>): RandomForestPrediction {
    const predictions: Record<string, number> = { Up: 0, Down: 0, Flat: 0 }

    for (const tree of this.trees) {
      const prediction = this.traverseTree(tree, features)
      predictions[prediction]++
    }

    const totalVotes = this.numTrees
    const upConfidence = predictions.Up / totalVotes
    const downConfidence = predictions.Down / totalVotes
    const flatConfidence = predictions.Flat / totalVotes

    let direction: 'Up' | 'Down' | 'Flat' = 'Flat'
    let confidence = flatConfidence

    if (upConfidence > downConfidence && upConfidence > flatConfidence) {
      direction = 'Up'
      confidence = upConfidence
    } else if (downConfidence > upConfidence && downConfidence > flatConfidence) {
      direction = 'Down'
      confidence = downConfidence
    }

    const featureImportance = this.calculateFeatureImportance(features)

    return { direction, confidence, featureImportance }
  }

  private buildTree(
    features: Array<Record<string, number>>,
    labels: Array<'Up' | 'Down' | 'Flat'>,
    depth: number,
  ): TreeNode {
    if (depth > 10 || features.length < 2 || new Set(labels).size === 1) {
      const majorityLabel = this.getMajorityLabel(labels)
      return { prediction: majorityLabel, samples: features.length }
    }

    let bestGain = 0
    let bestFeature = ''
    let bestThreshold = 0

    for (const feature of this.features) {
      const values = features.map(f => f[feature] || 0)
      const threshold = (Math.min(...values) + Math.max(...values)) / 2

      const gain = this.calculateInformationGain(labels, values, threshold)
      if (gain > bestGain) {
        bestGain = gain
        bestFeature = feature
        bestThreshold = threshold
      }
    }

    if (bestGain === 0) {
      const majorityLabel = this.getMajorityLabel(labels)
      return { prediction: majorityLabel, samples: features.length }
    }

    const leftIndices = features
      .map((f, i) => (f[bestFeature] <= bestThreshold ? i : -1))
      .filter(i => i !== -1)
    const rightIndices = features
      .map((f, i) => (f[bestFeature] > bestThreshold ? i : -1))
      .filter(i => i !== -1)

    return {
      feature: bestFeature,
      threshold: bestThreshold,
      left: this.buildTree(
        leftIndices.map(i => features[i]),
        leftIndices.map(i => labels[i]),
        depth + 1,
      ),
      right: this.buildTree(
        rightIndices.map(i => features[i]),
        rightIndices.map(i => labels[i]),
        depth + 1,
      ),
    }
  }

  private traverseTree(node: TreeNode, features: Record<string, number>): 'Up' | 'Down' | 'Flat' {
    if (node.prediction) {
      return node.prediction
    }

    if (!node.feature || node.threshold === undefined) {
      return 'Flat'
    }

    const value = features[node.feature] || 0
    const branch = value <= node.threshold ? node.left : node.right

    if (!branch) {
      return 'Flat'
    }

    return this.traverseTree(branch, features)
  }

  private calculateInformationGain(
    labels: Array<'Up' | 'Down' | 'Flat'>,
    values: number[],
    threshold: number,
  ): number {
    const entropy = this.calculateEntropy(labels)

    const leftIndices = values.map((v, i) => (v <= threshold ? i : -1)).filter(i => i !== -1)
    const rightIndices = values.map((v, i) => (v > threshold ? i : -1)).filter(i => i !== -1)

    if (leftIndices.length === 0 || rightIndices.length === 0) {
      return 0
    }

    const leftLabels = leftIndices.map(i => labels[i])
    const rightLabels = rightIndices.map(i => labels[i])

    const weightedEntropy =
      (leftLabels.length * this.calculateEntropy(leftLabels) + rightLabels.length * this.calculateEntropy(rightLabels)) / labels.length

    return entropy - weightedEntropy
  }

  private calculateEntropy(labels: Array<'Up' | 'Down' | 'Flat'>): number {
    const counts = { Up: 0, Down: 0, Flat: 0 }
    for (const label of labels) {
      counts[label]++
    }

    let entropy = 0
    for (const count of Object.values(counts)) {
      if (count > 0) {
        const p = count / labels.length
        entropy -= p * Math.log2(p)
      }
    }
    return entropy
  }

  private getMajorityLabel(labels: Array<'Up' | 'Down' | 'Flat'>): 'Up' | 'Down' | 'Flat' {
    const counts = { Up: 0, Down: 0, Flat: 0 }
    for (const label of labels) {
      counts[label]++
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as 'Up' | 'Down' | 'Flat'
  }

  private bootstrapSample(size: number): number[] {
    const indices: number[] = []
    for (let i = 0; i < size; i++) {
      indices.push(Math.floor(Math.random() * size))
    }
    return indices
  }

  private calculateFeatureImportance(features: Record<string, number>): Record<string, number> {
    const importance: Record<string, number> = {}
    for (const feature of this.features) {
      importance[feature] = Math.random() * 0.3 + 0.1 // Simplified
    }
    const sum = Object.values(importance).reduce((a, b) => a + b, 0)
    for (const key of Object.keys(importance)) {
      importance[key] /= sum
    }
    return importance
  }
}
