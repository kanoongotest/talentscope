/**
 * PURPOSE: Placeholder page for Pipeline module
 * OUTPUTS: Empty state with module description and phase indicator
 * RELATIONSHIPS: Linked from sidebar navigation
 */

import { Users } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { MODULE_DESCRIPTIONS } from '@/lib/constants'

export default function PipelinePage() {
  const mod = MODULE_DESCRIPTIONS['/pipeline']
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={<Users size={48} />}
        title="Pipeline"
        description={mod.description}
        ctaLabel={`Coming in Phase ${mod.phase}`}
      />
    </div>
  )
}
