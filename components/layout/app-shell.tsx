/**
 * PURPOSE: Combines sidebar + top bar + scrollable content area into the app layout
 * INPUTS: children (page content)
 * OUTPUTS: Full-page layout with fixed sidebar and scrollable main area
 * RELATIONSHIPS: Wraps all pages, uses sidebar-navigation.tsx and top-bar.tsx
 */

import { SidebarNavigation } from './sidebar-navigation'
import { TopBar } from './top-bar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      <SidebarNavigation />
      <div className="ml-[220px] flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
