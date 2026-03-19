/**
 * PURPOSE: Display AI predictions and actionable recommendations for a candidate
 * INPUTS: Predictions text and recommendations text
 * OUTPUTS: Two-column card with predictions left, recommendations right
 * RELATIONSHIPS: Used by app/analyzer/[id]/page.tsx
 */

import { Sparkles, ArrowRight } from 'lucide-react'

interface Props {
  predictions: string
  recommendations: string
}

export function PredictionAndRecommendations({ predictions, recommendations }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-purple-500" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            What to Expect
          </h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{predictions || 'No predictions available.'}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight size={16} className="text-blue-500" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Recommended Next Steps
          </h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{recommendations || 'No recommendations available.'}</p>
      </div>
    </div>
  )
}
