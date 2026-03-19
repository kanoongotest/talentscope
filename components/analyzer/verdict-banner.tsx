/**
 * PURPOSE: Full-width colored verdict banner — the one-second answer for hiring managers
 * INPUTS: Score band (A/B/C/D)
 * OUTPUTS: Colored banner with icon, verdict text, and short recommendation
 * RELATIONSHIPS: Used by analysis-results-view.tsx, top of results page
 */

import { CheckCircle, ArrowRight, AlertTriangle, XCircle } from 'lucide-react'

interface Props {
  band: string
  verdictShort?: string | null
}

const BAND_CONFIG: Record<string, {
  bg: string; border: string; text: string; icon: typeof CheckCircle; label: string
}> = {
  A: {
    bg: 'bg-green-50', border: 'border-l-green-500', text: 'text-green-800',
    icon: CheckCircle, label: 'Strong Hire — Schedule the interview.',
  },
  B: {
    bg: 'bg-blue-50', border: 'border-l-[#185CE3]', text: 'text-blue-800',
    icon: ArrowRight, label: 'Promising — Standard interview process recommended.',
  },
  C: {
    bg: 'bg-amber-50', border: 'border-l-amber-500', text: 'text-amber-800',
    icon: AlertTriangle, label: 'Has Potential — Dig deeper before deciding. Key gaps flagged below.',
  },
  D: {
    bg: 'bg-red-50', border: 'border-l-red-500', text: 'text-red-800',
    icon: XCircle, label: 'Not Recommended — Significant concerns identified.',
  },
}

export function VerdictBanner({ band, verdictShort }: Props) {
  const config = BAND_CONFIG[band] || BAND_CONFIG.D
  const Icon = config.icon

  return (
    <div className={`rounded-lg border-l-4 ${config.border} ${config.bg} p-4`}>
      <div className="flex items-center gap-3">
        <Icon size={22} className={config.text} />
        <div>
          <p className={`text-sm font-semibold ${config.text}`}>{config.label}</p>
          {verdictShort && (
            <p className={`text-xs mt-0.5 ${config.text} opacity-80`}>{verdictShort}</p>
          )}
        </div>
      </div>
    </div>
  )
}
