/**
 * PURPOSE: Company detail page with full profile, bleed score, and signal timeline
 * INPUTS: Dynamic route param [id] for company ID
 * OUTPUTS: Complete company profile view with signal management
 * RELATIONSHIPS: Uses company-profile-header, company-profile-details, company-signal-timeline
 */

import { notFound } from 'next/navigation'
import { fetchCompanyById } from '@/lib/queries/company-queries'
import { CompanyProfileHeader } from '@/components/radar/company-profile-header'
import { CompanyProfileDetails } from '@/components/radar/company-profile-details'
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

  return (
    <div className="space-y-6 max-w-4xl">
      <CompanyProfileHeader company={company} />
      <CompanyProfileDetails company={company} />
      <CompanySignalTimeline companyId={company.id} />
    </div>
  )
}
