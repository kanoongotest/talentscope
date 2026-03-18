/**
 * PURPOSE: Dashboard home page with live KPI stats and company distribution
 * INPUTS: None (fetches data server-side from Supabase)
 * OUTPUTS: KPI cards, activity feed, quick actions, company distribution
 * RELATIONSHIPS: Uses dashboard components, reads from Supabase tables
 */

import { supabase } from '@/lib/supabase-client'
import { KpiStatCard } from '@/components/dashboard/kpi-stat-card'
import { RecentActivityFeed } from '@/components/dashboard/recent-activity-feed'
import { QuickActionsPanel } from '@/components/dashboard/quick-actions-panel'
import { CompanyDistribution } from '@/components/dashboard/company-distribution'

async function getDashboardData() {
  const [companiesRes, signalsRes, resumesRes, candidatesRes, tierRes, regionRes] =
    await Promise.all([
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('signals').select('*', { count: 'exact', head: true }),
      supabase.from('resume_analyses').select('*', { count: 'exact', head: true }),
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase.rpc('get_tier_distribution'),
      supabase.rpc('get_region_distribution'),
    ])

  /* Tier counts — fallback if RPC doesn't exist */
  let tierData = tierRes.data ?? []
  if (!tierData.length) {
    const { data } = await supabase.from('companies').select('tier')
    if (data) {
      const counts: Record<string, number> = {}
      data.forEach((r: { tier: string }) => {
        counts[r.tier] = (counts[r.tier] || 0) + 1
      })
      tierData = Object.entries(counts)
        .map(([tier, count]) => ({ tier, count }))
        .sort((a, b) => a.tier.localeCompare(b.tier))
    }
  }

  /* Region counts — fallback if RPC doesn't exist */
  let regionData = regionRes.data ?? []
  if (!regionData.length) {
    const { data } = await supabase.from('companies').select('region')
    if (data) {
      const counts: Record<string, number> = {}
      data.forEach((r: { region: string }) => {
        const key = r.region || 'Unknown'
        counts[key] = (counts[key] || 0) + 1
      })
      regionData = Object.entries(counts)
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    }
  }

  /* Tier subtitle for KPI card */
  const tierSubtitle = tierData
    .map((t: { tier: string; count: number }) => `${t.tier}: ${t.count}`)
    .join(' · ')

  /* Signal severity counts */
  let criticalCount = 0
  let elevatedCount = 0
  if ((signalsRes.count ?? 0) > 0) {
    const { data } = await supabase.from('signals').select('severity')
    if (data) {
      data.forEach((s: { severity: string }) => {
        if (s.severity === 'critical') criticalCount++
        if (s.severity === 'elevated') elevatedCount++
      })
    }
  }

  /* Candidate company count */
  let candidateCompanyCount = 0
  if ((candidatesRes.count ?? 0) > 0) {
    const { data } = await supabase.from('candidates').select('company_id')
    if (data) {
      candidateCompanyCount = new Set(data.map((c: { company_id: string }) => c.company_id)).size
    }
  }

  return {
    companiesCount: companiesRes.count ?? 0,
    signalsCount: signalsRes.count ?? 0,
    resumesCount: resumesRes.count ?? 0,
    candidatesCount: candidatesRes.count ?? 0,
    tierSubtitle: tierSubtitle || 'No tier data',
    signalSubtitle: `Critical: ${criticalCount} · Elevated: ${elevatedCount}`,
    candidateSubtitle: candidateCompanyCount > 0 ? `Across ${candidateCompanyCount} companies` : 'No candidates yet',
    tierData,
    regionData,
    total: companiesRes.count ?? 0,
  }
}

export default async function DashboardPage() {
  const d = await getDashboardData()

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiStatCard label="Companies Tracked" value={d.companiesCount} subtitle={d.tierSubtitle} borderColor="#185CE3" />
        <KpiStatCard label="Active Signals" value={d.signalsCount} subtitle={d.signalSubtitle} borderColor="#D97706" />
        <KpiStatCard label="Resumes Analyzed" value={d.resumesCount} subtitle="This month" borderColor="#16A34A" />
        <KpiStatCard label="Pipeline Candidates" value={d.candidatesCount} subtitle={d.candidateSubtitle} borderColor="#185CE3" />
      </div>

      {/* Row 2: Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <RecentActivityFeed />
        <QuickActionsPanel />
      </div>

      {/* Row 3: Company Distribution */}
      <CompanyDistribution tierData={d.tierData} regionData={d.regionData} total={d.total} />
    </div>
  )
}
