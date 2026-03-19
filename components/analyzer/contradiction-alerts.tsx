/**
 * PURPOSE: Display contradiction flags detected by AI during resume analysis
 * INPUTS: Array of contradiction flag strings
 * OUTPUTS: Amber warning card with bullet-pointed contradictions, or nothing if empty
 * RELATIONSHIPS: Used by app/analyzer/[id]/page.tsx
 */

import { AlertTriangle } from 'lucide-react'

interface Props {
  flags: string[]
}

export function ContradictionAlerts({ flags }: Props) {
  if (!flags || flags.length === 0) return null

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-amber-600" />
        <h3 className="text-sm font-semibold text-amber-800">
          Contradictions Detected ({flags.length})
        </h3>
      </div>
      <ul className="space-y-2">
        {flags.map((flag, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
            <span className="text-amber-500 mt-0.5 shrink-0">•</span>
            {flag}
          </li>
        ))}
      </ul>
    </div>
  )
}
