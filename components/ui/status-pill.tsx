/**
 * PURPOSE: Reusable status badge/pill component
 * INPUTS: label string, variant (blue | green | amber | red | gray)
 * OUTPUTS: Styled inline badge element
 * RELATIONSHIPS: Used in sidebar nav, KPI cards, activity feeds
 */

const VARIANT_STYLES = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-gray-100 text-gray-500',
} as const

type Variant = keyof typeof VARIANT_STYLES

export function StatusPill({ label, variant = 'gray' }: { label: string; variant?: Variant }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold tracking-wide ${VARIANT_STYLES[variant]}`}
    >
      {label}
    </span>
  )
}
