/**
 * PURPOSE: Company detail page with profile, AI enrichment, bleed score, strategy brief, signals
 * INPUTS: Dynamic route param [id] for company ID
 * OUTPUTS: Complete company profile view with AI intelligence panels
 * RELATIONSHIPS: Uses profile-header, profile-details, enrichment-panel, bleed-score-panel,
 *   strategy-brief-panel, signal-timeline from components/radar/
 */

import { notFound } from 'next/navigation'
import { fetchCompanyById } from '@/lib/queries/company-queries'
import { CompanyProfileHeader } from '@/components/radar/company-profile-header'
import { CompanyProfileDetails } from '@/components/radar/company-profile-details'
import { EnrichmentPanel } from '@/components/radar/enrichment-panel'
import { BleedScorePanel } from '@/components/radar/bleed-score-panel'
import { StrategyBriefPanel } from '@/components/radar/strategy-brief-panel'
import { CompanySignalTimeline } from '@/components/radar/company-signal-timeline'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params

  let company
  try {
    company = await fetchCompanyById(id)
  } catch {
    notFound()
  }

  if (!company) notFound()

  const enrichmentValues = {
    headcount_estimate: company.headcount_estimate,
    funding_status: company.funding_status,
    key_people: company.key_people,
    tech_stack: company.tech_stack,
    revenue_tier: company.revenue_tier,
    enrichment_notes: company.enrichment_notes,
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <CompanyProfileHeader company={company} />
      <CompanyProfileDetails company={company} />
      <EnrichmentPanel companyId={company.id} currentValues={enrichmentValues} />
      <BleedScorePanel
        companyId={company.id}
        initialScore={company.bleed_score}
        initialReasoning={company.bleed_score_reasoning}
        initialConfidence={company.bleed_score_confidence}
        initialUpdatedAt={company.bleed_score_updated_at}
      />
      <StrategyBriefPanel companyId={company.id} />
      <CompanySignalTimeline companyId={company.id} />
    </div>
  )
}
