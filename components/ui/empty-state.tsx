/**
 * PURPOSE: Reusable empty state component for modules with no data
 * INPUTS: icon (ReactNode), title, description, optional CTA (label + href)
 * OUTPUTS: Centered placeholder UI
 * RELATIONSHIPS: Used by placeholder pages, recent-activity-feed, and future modules
 */

import Link from 'next/link'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
}

export function EmptyState({ icon, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-gray-300">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3] transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
