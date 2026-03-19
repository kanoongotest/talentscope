/**
 * PURPOSE: Single dimension score with expectation marker bar and collapsible reasoning
 * INPUTS: Dimension name, weight, score, expected score, reasoning, confidence info, expanded state
 * OUTPUTS: Card with score-vs-expectation bar, collapsible detail panel
 * RELATIONSHIPS: Used by analysis-results-view.tsx
 */

interface Props {
  name: string
  weight: string
  score: number
  expected: number
  reasoning: string
  confidence: string
  confidenceReason: string
  expanded: boolean
  onToggle: () => void
}

function barColor(score: number, expected: number): string {
  if (score >= expected) return 'bg-green-500'
  if (score >= expected - 10) return 'bg-amber-500'
  return 'bg-red-500'
}

function scoreTextColor(score: number, expected: number): string {
  if (score >= expected) return 'text-green-600'
  if (score >= expected - 10) return 'text-amber-600'
  return 'text-red-600'
}

const CONFIDENCE_STYLES: Record<string, string> = {
  High: 'bg-green-50 text-green-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-red-50 text-red-700',
}

export function DimensionScoreCard({
  name, weight, score, expected, reasoning, confidence, confidenceReason, expanded, onToggle,
}: Props) {
  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-4 cursor-pointer hover:border-gray-300 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
          <p className="text-[10px] text-gray-400">{weight}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${scoreTextColor(score, expected)}`}>{score}</span>
          <span className="text-[10px] text-gray-400">/ {expected}</span>
        </div>
      </div>

      <div className="relative w-full h-2 bg-gray-100 rounded-full mb-1">
        <div
          className={`h-2 rounded-full transition-all ${barColor(score, expected)}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
        <div
          className="absolute top-0 w-0.5 h-2 bg-gray-500"
          style={{ left: `${Math.min(expected, 100)}%` }}
          title={`Expected: ${expected}`}
        />
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{reasoning}</p>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES.Low}`}>
              {confidence} Confidence
            </span>
            <span className="text-[10px] text-gray-400">{confidenceReason}</span>
          </div>
        </div>
      )}

      {!expanded && (
        <p className="text-[10px] text-gray-400 mt-1">Click to expand analysis</p>
      )}
    </div>
  )
}
