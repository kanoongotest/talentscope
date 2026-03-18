/**
 * PURPOSE: Reusable KPI card with colored top border, big number, and subtitle
 * INPUTS: label, value (number), subtitle, borderColor (hex)
 * OUTPUTS: White card with colored accent and formatted stats
 * RELATIONSHIPS: Used by app/page.tsx dashboard
 */

interface KpiStatCardProps {
  label: string
  value: number
  subtitle: string
  borderColor: string
}

export function KpiStatCard({ label, value, subtitle, borderColor }: KpiStatCardProps) {
  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-5"
      style={{ borderTopWidth: '4px', borderTopColor: borderColor }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}
