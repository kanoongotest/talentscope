/**
 * PURPOSE: Panel with shortcut buttons to key modules
 * INPUTS: None
 * OUTPUTS: Card with 3 action links (Radar, Analyzer, Questions)
 * RELATIONSHIPS: Used on the dashboard page, links to module routes
 */

import Link from 'next/link'
import { Building2, FileSearch, MessageSquare, ArrowRight } from 'lucide-react'

const ACTIONS = [
  { label: 'Browse Companies', href: '/radar', icon: Building2 },
  { label: 'Analyze Resume', href: '/analyzer', icon: FileSearch },
  { label: 'Generate Questions', href: '/questions', icon: MessageSquare },
] as const

export function QuickActionsPanel() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-col gap-2">
        {ACTIONS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:shadow-md"
          >
            <Icon size={18} className="text-gray-400" />
            <span className="flex-1">{label}</span>
            <ArrowRight size={16} className="text-gray-300" />
          </Link>
        ))}
      </div>
    </div>
  )
}
