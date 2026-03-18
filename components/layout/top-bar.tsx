/**
 * PURPOSE: Top bar with time-based greeting, breadcrumb, and user avatar
 * INPUTS: None (reads current pathname for page context)
 * OUTPUTS: 56px horizontal bar at top of main content area
 * RELATIONSHIPS: Used by app-shell.tsx, reads from lib/constants.ts
 */

'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { MODULES } from '@/lib/constants'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getPageName(pathname: string): string {
  const mod = MODULES.find((m) => m.href === pathname)
  return mod?.name ?? 'TalentScope'
}

export function TopBar() {
  const pathname = usePathname()
  const pageName = getPageName(pathname)

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Left — Greeting */}
      <div>
        <h1 className="text-sm font-semibold text-gray-900">
          {getGreeting()}, Vikas
        </h1>
        <p className="text-xs text-gray-500">{pageName}</p>
      </div>

      {/* Right — Bell + Avatar */}
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-500">
            0
          </span>
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#185CE3] text-xs font-semibold text-white">
          VK
        </div>
      </div>
    </header>
  )
}
