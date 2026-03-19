/**
 * PURPOSE: Two-column strengths and concerns display for quick scanning
 * INPUTS: Arrays of strength and concern strings from AI output
 * OUTPUTS: Green strengths column + amber concerns column
 * RELATIONSHIPS: Used by analysis-results-view.tsx
 */

import { ThumbsUp, AlertCircle } from 'lucide-react'

interface Props {
  strengths: string[] | null
  concerns: string[] | null
}

export function KeyHighlights({ strengths, concerns }: Props) {
  if ((!strengths || strengths.length === 0) && (!concerns || concerns.length === 0)) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-green-200 bg-green-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsUp size={16} className="text-green-600" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-green-700">
            Why You Should Interview
          </h3>
        </div>
        {strengths && strengths.length > 0 ? (
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                <span className="text-green-500 mt-0.5 shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-green-700 opacity-60">No standout strengths identified.</p>
        )}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-amber-600" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            What to Watch Out For
          </h3>
        </div>
        {concerns && concerns.length > 0 ? (
          <ul className="space-y-2">
            {concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-amber-700 opacity-60">No major concerns flagged.</p>
        )}
      </div>
    </div>
  )
}
