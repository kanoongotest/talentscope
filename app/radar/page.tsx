/**
 * PURPOSE: Placeholder page for Radar module
 * OUTPUTS: Empty state with module description and phase indicator
 * RELATIONSHIPS: Linked from sidebar navigation
 */

import { Radio } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { MODULE_DESCRIPTIONS } from '@/lib/constants'

export default function RadarPage() {
  const mod = MODULE_DESCRIPTIONS['/radar']
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={<Radio size={48} />}
        title="Radar"
        description={mod.description}
        ctaLabel={`Coming in Phase ${mod.phase}`}
      />
    </div>
  )
}
