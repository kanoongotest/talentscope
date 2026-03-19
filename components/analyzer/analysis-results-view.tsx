/**
 * PURPOSE: Master layout for full analysis results — assembles all result sub-components
 * INPUTS: Full AnalysisRecord
 * OUTPUTS: Complete results display with scores, contradictions, predictions
 * RELATIONSHIPS: Used by app/analyzer/[id]/page.tsx, composes dimension-score-card, etc.
 */

import Link from 'next/link'
import type { AnalysisRecord } from '@/lib/queries/analysis-queries'
import { ScoreSummaryHeader } from './score-summary-header'
import { DimensionScoreCard } from './dimension-score-card'
import { ContradictionAlerts } from './contradiction-alerts'
import { PredictionAndRecommendations } from './prediction-and-recommendations'

interface Props {
  analysis: AnalysisRecord
}

const DIMENSION_META = [
  { key: 'technical', name: 'Technical Proficiency', weight: '25% weight' },
  { key: 'wordpress', name: 'WordPress Expertise', weight: '25% weight' },
  { key: 'culture', name: 'Culture & Communication', weight: '15% weight' },
  { key: 'ai_proficiency', name: 'AI Proficiency', weight: '10% weight' },
  { key: 'remote', name: 'Remote Readiness', weight: '10% weight' },
  { key: 'professional', name: 'Professional Trajectory', weight: '15% weight' },
] as const

export function AnalysisResultsView({ analysis }: Props) {
  const agents = (analysis.agent_results || {}) as Record<
    string,
    { score: number; reasoning: string; confidence: string; confidence_reason: string }
  >

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/analyzer"
        className="inline-flex items-center gap-1 text-sm text-[#185CE3] hover:underline"
      >
        ← Back to Analyzer
      </Link>

      <ScoreSummaryHeader
        candidateName={analysis.candidate_name}
        scoreTotal={analysis.score_total}
        scoreBand={analysis.score_band}
        executiveSummary={analysis.executive_summary}
        roleType={analysis.role_type}
        seniorityLevel={analysis.seniority_level}
        createdAt={analysis.created_at}
        modelUsed={analysis.ai_model_used}
        latencyMs={analysis.latency_ms}
      />

      <ContradictionAlerts flags={analysis.contradiction_flags} />

      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Dimension Scores
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {DIMENSION_META.map((dim) => {
            const agent = agents[dim.key]
            if (!agent) return null
            return (
              <DimensionScoreCard
                key={dim.key}
                name={dim.name}
                weight={dim.weight}
                score={agent.score}
                reasoning={agent.reasoning}
                confidence={agent.confidence}
                confidenceReason={agent.confidence_reason}
              />
            )
          })}
        </div>
      </div>

      <PredictionAndRecommendations
        predictions={analysis.predictions}
        recommendations={analysis.ai_recommendations}
      />

      <div className="flex items-center gap-3">
        <Link
          href="/analyzer"
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Analyze Another
        </Link>
        <Link
          href="/questions"
          className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3]"
        >
          Generate Follow-Up Questions →
        </Link>
      </div>
    </div>
  )
}
