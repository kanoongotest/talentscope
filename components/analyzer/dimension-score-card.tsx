/**
 * PURPOSE: Single dimension score display with bar, reasoning, and confidence badge
 * INPUTS: Dimension name, weight, score, reasoning, confidence info
 * OUTPUTS: Card with progress bar, reasoning text, confidence badge
 * RELATIONSHIPS: Used by analysis-results-view.tsx
 */

interface Props {
  name: string
  weight: string
  score: number
  reasoning: string
  confidence: string
  confidenceReason: string
}

function barColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-blue-500'
  return 'bg-red-500'
}

function scoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-blue-600'
  return 'text-red-600'
}

const CONFIDENCE_STYLES: Record<string, string> = {
  High: 'bg-green-50 text-green-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-red-50 text-red-700',
}

export function DimensionScoreCard({ name, weight, score, reasoning, confidence, confidenceReason }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
          <p className="text-[10px] text-gray-400">{weight}</p>
        </div>
        <span className={`text-2xl font-bold ${scoreTextColor(score)}`}>{score}</span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full mb-3">
        <div
          className={`h-2 rounded-full transition-all ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-3">{reasoning}</p>

      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES.Low}`}>
          {confidence} Confidence
        </span>
        <span className="text-[10px] text-gray-400">{confidenceReason}</span>
      </div>
    </div>
  )
}
