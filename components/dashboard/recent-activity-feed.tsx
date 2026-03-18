/**
 * PURPOSE: Activity feed showing recent system events; displays empty state when no data
 * INPUTS: None
 * OUTPUTS: Card with activity list or empty state placeholder
 * RELATIONSHIPS: Used on dashboard page, links to /radar as CTA
 */

import { Activity } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export function RecentActivityFeed() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
        Recent Activity
      </h2>
      <EmptyState
        icon={<Activity size={40} />}
        title="No activity yet"
        description="Activity from Radar signals, resume analyses, and pipeline updates will appear here."
        ctaLabel="Browse Companies →"
        ctaHref="/radar"
      />
    </div>
  )
}
