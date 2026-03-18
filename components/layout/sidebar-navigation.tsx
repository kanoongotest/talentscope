/**
 * PURPOSE: Fixed left sidebar with logo, navigation links, and version indicator
 * INPUTS: None (reads current pathname for active state)
 * OUTPUTS: 220px dark sidebar with grouped navigation items
 * RELATIONSHIPS: Used by app-shell.tsx, reads from lib/constants.ts
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Radio, FileSearch, MessageSquare,
  Users, Code, Settings, HelpCircle,
} from 'lucide-react'
import { MODULES, BOTTOM_NAV, APP_VERSION, APP_NAME, APP_TAGLINE } from '@/lib/constants'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, Radio, FileSearch, MessageSquare,
  Users, Code, Settings, HelpCircle,
}

export function SidebarNavigation() {
  const pathname = usePathname()
  const intelligence = MODULES.filter((m) => m.section === 'intelligence')
  const workflow = MODULES.filter((m) => m.section === 'workflow')

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#0E1B3C] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[#185CE3] text-white font-bold text-lg shrink-0">
          TS
        </div>
        <div>
          <div className="text-[13px] font-bold text-white leading-tight">{APP_NAME}</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/35">
            {APP_TAGLINE}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 mt-2">
        <SectionLabel>Intelligence</SectionLabel>
        {intelligence.map((m) => (
          <NavItem key={m.href} module={m} active={pathname === m.href} />
        ))}

        <SectionLabel className="mt-5">Workflow</SectionLabel>
        {workflow.map((m) => (
          <NavItem key={m.href} module={m} active={pathname === m.href} />
        ))}

        <div className="my-4 border-t border-white/[0.08]" />

        {BOTTOM_NAV.map((item) => {
          const Icon = ICON_MAP[item.icon]
          return (
            <div
              key={item.name}
              className="flex items-center gap-3 rounded px-3 py-2 text-[13px] text-white/40 cursor-default"
            >
              {Icon && <Icon size={18} />}
              <span>{item.name}</span>
              <span className="ml-auto text-[10px] bg-white/10 rounded px-1.5 py-0.5">
                COMING SOON
              </span>
            </div>
          )
        })}
      </nav>

      {/* Version pill */}
      <div className="px-5 py-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          v{APP_VERSION}
        </div>
      </div>
    </aside>
  )
}

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/35 ${className}`}>
      {children}
    </div>
  )
}

function NavItem({ module, active }: { module: (typeof MODULES)[number]; active: boolean }) {
  const Icon = ICON_MAP[module.icon]
  return (
    <Link
      href={module.href}
      className={`flex items-center gap-3 rounded px-3 py-2 text-[13px] transition-colors ${
        active
          ? 'border-l-[3px] border-[#185CE3] bg-[rgba(24,92,227,0.25)] text-white font-medium'
          : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      {Icon && <Icon size={18} />}
      <span>{module.name}</span>
      {'badge' in module && module.badge && (
        <span className="ml-auto text-[11px] bg-white/15 rounded px-1.5 py-0.5 text-white/70">
          {module.badge}
        </span>
      )}
    </Link>
  )
}
