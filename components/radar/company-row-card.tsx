/**
 * PURPOSE: Single company row in the Radar company list table
 * INPUTS: CompanyRow data (name, website, tier, category, region, bleed_score, signal_count)
 * OUTPUTS: Clickable table row with formatted data and tier/bleed badges
 * RELATIONSHIPS: Used by company-list-table.tsx, links to app/radar/[id]
 */

import Link from 'next/link'
import type { CompanyRow } from '@/lib/queries/company-queries'

const TIER_STYLES: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-gray-100 text-gray-700',
  3: 'bg-gray-50 text-gray-500',
}

function bleedColor(score: number | null): string {
  if (!score) return ''
  if (score <= 30) return 'text-green-600'
  if (score <= 60) return 'text-amber-600'
  return 'text-red-600'
}

export function CompanyRowCard({ company }: { company: CompanyRow }) {
  const tier = company.tier || 0
  const bleed = company.bleed_score

  return (
    <Link
      href={`/radar/${company.id}`}
      className="contents group"
    >
      <td className="px-4 py-3 text-sm font-medium text-gray-900 group-hover:text-[#185CE3]">
        {company.name}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]">
        {company.website || '—'}
      </td>
      <td className="px-4 py-3">
        {tier > 0 && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${TIER_STYLES[tier] || ''}`}>
            Tier {tier}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{company.category || '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{company.region || '—'}</td>
      <td className={`px-4 py-3 text-sm font-semibold ${bleedColor(bleed)}`}>
        {bleed ? bleed : '—'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {company.signal_count > 0 ? company.signal_count : '—'}
      </td>
    </Link>
  )
}
