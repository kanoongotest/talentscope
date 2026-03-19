/**
 * PURPOSE: Overall analysis confidence based on data completeness
 * INPUTS: Whether application answers and additional context were provided
 * OUTPUTS: Confidence level badge with explanation
 * RELATIONSHIPS: Used by analysis-results-view.tsx
 */

interface Props {
  hasAnswers: boolean
  hasContext: boolean
}

export function AnalysisConfidenceIndicator({ hasAnswers, hasContext }: Props) {
  let level: 'High' | 'Medium' | 'Low'
  let explanation: string

  if (hasAnswers && hasContext) {
    level = 'High'
    explanation = 'Based on resume + written answers + recruiter context. Reliable assessment.'
  } else if (hasAnswers || hasContext) {
    level = 'Medium'
    explanation = 'Based on resume + partial context. Consider gathering more data for a fuller picture.'
  } else {
    level = 'Low'
    explanation = 'Resume only. Use these scores as directional, not definitive.'
  }

  const styles = {
    High: 'bg-green-50 text-green-700 border-green-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs ${styles[level]}`}>
      <span className="font-semibold">Analysis Confidence: {level}</span>
      <span className="opacity-70">— {explanation}</span>
    </div>
  )
}
