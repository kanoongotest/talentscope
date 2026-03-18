/**
 * PURPOSE: Shows tier and region breakdown of tracked companies
 * INPUTS: tierData (array of {tier, count}), regionData (array of {region, count})
 * OUTPUTS: Card with horizontal bar chart for tiers and list for regions
 * RELATIONSHIPS: Used on dashboard page, data fetched from Supabase in page.tsx
 */

interface TierRow {
  tier: string
  count: number
}

interface RegionRow {
  region: string
  count: number
}

interface CompanyDistributionProps {
  tierData: TierRow[]
  regionData: RegionRow[]
  total: number
}

export function CompanyDistribution({ tierData, regionData, total }: CompanyDistributionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
        Company Distribution
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tier breakdown */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-3">By Tier</h3>
          <div className="flex flex-col gap-3">
            {tierData.map(({ tier, count }) => (
              <div key={tier}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{tier}</span>
                  <span className="text-gray-500">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-[#185CE3]"
                    style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Region breakdown */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-3">By Region</h3>
          <div className="flex flex-col gap-2">
            {regionData.map(({ region, count }) => (
              <div key={region} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{region || 'Unknown'}</span>
                <span className="text-gray-500 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
