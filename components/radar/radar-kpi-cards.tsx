/**
 * PURPOSE: Three KPI stat cards for the Radar page header
 * INPUTS: Stats from company-queries and signal-queries
 * OUTPUTS: Row of 3 cards: Total Companies, Companies with Signals, Critical Signals
 * RELATIONSHIPS: Used by app/radar/page.tsx, reuses KpiStatCard component
 */

import { KpiStatCard } from '@/components/dashboard/kpi-stat-card'
import { fetchCompanyStats } from '@/lib/queries/company-queries'
import { fetchSignalStats } from '@/lib/queries/signal-queries'

export async function RadarKpiCards() {
  const [companyStats, signalStats] = await Promise.all([
    fetchCompanyStats(),
    fetchSignalStats(),
  ])

  const tierBreakdown = `T1: ${companyStats.tierCounts[1]} · T2: ${companyStats.tierCounts[2]} · T3: ${companyStats.tierCounts[3]}`

  return (
    <div className="grid grid-cols-3 gap-4">
      <KpiStatCard
        label="Total Companies"
        value={companyStats.total}
        subtitle={tierBreakdown}
        borderColor="#185CE3"
      />
      <KpiStatCard
        label="Companies with Signals"
        value={signalStats.companiesWithSignals}
        subtitle={`${signalStats.totalSignals} total signals tracked`}
        borderColor="#F59E0B"
      />
      <KpiStatCard
        label="Critical Signals"
        value={signalStats.criticalCount}
        subtitle="Requires immediate attention"
        borderColor="#EF4444"
      />
    </div>
  )
}
