/**
 * PURPOSE: Analysis results page — shareable URL showing full AI scoring results
 * INPUTS: Dynamic route param [id] for analysis ID
 * OUTPUTS: Complete results view with scores, contradictions, predictions
 * RELATIONSHIPS: Uses analysis-results-view, fetches from analysis-queries
 */

import { notFound } from 'next/navigation'
import { fetchAnalysisById } from '@/lib/queries/analysis-queries'
import { AnalysisResultsView } from '@/components/analyzer/analysis-results-view'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AnalysisResultsPage({ params }: PageProps) {
  const { id } = await params

  let analysis
  try {
    analysis = await fetchAnalysisById(id)
  } catch {
    notFound()
  }

  if (!analysis) notFound()

  return <AnalysisResultsView analysis={analysis} />
}
