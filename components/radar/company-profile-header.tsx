/**
 * PURPOSE: Top section of the company detail page with name, badges, and key identifiers
 * INPUTS: Company record from Supabase
 * OUTPUTS: Header with company name, website link, tier/category/region badges, WP status
 * RELATIONSHIPS: Used by app/radar/[id]/page.tsx
 */

import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

interface Props {
  company: {
    name: string
    website: string | null
    tier: number | null
    category: string | null
    region: string | null
    wp_verify: boolean | null
    specialization: string | null
  }
}

const TIER_STYLES: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-gray-100 text-gray-700',
  3: 'bg-gray-50 text-gray-500',
}

export function CompanyProfileHeader({ company }: Props) {
  return (
    <div>
      <Link
        href="/radar"
        className="inline-flex items-center gap-1 text-sm text-[#185CE3] hover:underline mb-4"
      >
        <ArrowLeft size={14} />
        Back to Radar
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>

        {company.website && (
          <a
            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#185CE3] hover:underline mt-1 inline-block"
          >
            {company.website}
          </a>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {company.tier && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${TIER_STYLES[company.tier] || ''}`}>
              Tier {company.tier}
            </span>
          )}
          {company.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
              {company.category}
            </span>
          )}
          {company.region && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {company.region}
            </span>
          )}
          {company.wp_verify ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
              <CheckCircle size={14} /> WP Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
              <XCircle size={14} /> Unverified
            </span>
          )}
        </div>

        {company.specialization && (
          <p className="mt-2 text-sm text-gray-600">{company.specialization}</p>
        )}
      </div>
    </div>
  )
}
