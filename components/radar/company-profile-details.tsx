/**
 * PURPOSE: Two-column grid showing all enrichment fields for a company
 * INPUTS: Company record with all fields from Supabase
 * OUTPUTS: White card with labeled fields, muted "—" for null values
 * RELATIONSHIPS: Used by app/radar/[id]/page.tsx
 */

interface Props {
  company: {
    headcount_estimate: number | null
    funding_status: string | null
    glassdoor_score: number | null
    revenue_tier: string | null
    tech_stack: string | null
    linkedin_url: string | null
    github_org_url: string | null
    key_people: string | null
    source_pool: string | null
    last_enriched_at: string | null
    bleed_score: number | null
    bleed_score_reasoning: string | null
    bleed_score_confidence: string | null
    bleed_score_updated_at: string | null
  }
}

function Field({ label, value, href }: { label: string; value: string | number | null; href?: string }) {
  const display = value ?? '—'
  const isMuted = value === null || value === undefined

  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className={`mt-1 text-sm ${isMuted ? 'text-gray-300' : 'text-gray-900'}`}>
        {href && value ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#185CE3] hover:underline">
            {display}
          </a>
        ) : (
          String(display)
        )}
      </dd>
    </div>
  )
}

function bleedColor(score: number): string {
  if (score <= 30) return 'text-green-600'
  if (score <= 60) return 'text-amber-600'
  return 'text-red-600'
}

export function CompanyProfileDetails({ company }: Props) {
  const enrichedDate = company.last_enriched_at
    ? new Date(company.last_enriched_at).toLocaleDateString()
    : null

  return (
    <div className="space-y-6">
      {/* Company Details Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Company Details
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Field label="Headcount Estimate" value={company.headcount_estimate ? String(company.headcount_estimate) : null} />
          <Field label="LinkedIn" value={company.linkedin_url} href={company.linkedin_url || undefined} />
          <Field label="Funding Status" value={company.funding_status} />
          <Field label="GitHub Org" value={company.github_org_url} href={company.github_org_url || undefined} />
          <Field label="Glassdoor Score" value={company.glassdoor_score} />
          <Field label="Key People" value={company.key_people} />
          <Field label="Revenue Tier" value={company.revenue_tier} />
          <Field label="Source Pool" value={company.source_pool} />
          <Field label="Tech Stack" value={company.tech_stack} />
          <Field label="Last Enriched" value={enrichedDate} />
        </div>
      </div>

      {/* Bleed Score Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Bleed Score
        </h2>
        {company.bleed_score && company.bleed_score > 0 ? (
          <div className="space-y-3">
            <p className={`text-4xl font-bold ${bleedColor(company.bleed_score)}`}>
              {company.bleed_score}
            </p>
            {company.bleed_score_reasoning && (
              <p className="text-sm text-gray-700">{company.bleed_score_reasoning}</p>
            )}
            <div className="flex gap-6 text-xs text-gray-500">
              {company.bleed_score_confidence && <span>Confidence: {company.bleed_score_confidence}</span>}
              {company.bleed_score_updated_at && (
                <span>Updated: {new Date(company.bleed_score_updated_at).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            No bleed score yet. AI scoring will be available in Phase 2B.
          </p>
        )}
      </div>
    </div>
  )
}
