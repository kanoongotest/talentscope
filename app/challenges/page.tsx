/**
 * PURPOSE: Placeholder page for Challenge Lab module
 * OUTPUTS: Empty state with module description and phase indicator
 * RELATIONSHIPS: Linked from sidebar navigation
 */

import { Code } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { MODULE_DESCRIPTIONS } from '@/lib/constants'

export default function ChallengesPage() {
  const mod = MODULE_DESCRIPTIONS['/challenges']
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={<Code size={48} />}
        title="Challenge Lab"
        description={mod.description}
        ctaLabel={`Coming in Phase ${mod.phase}`}
      />
    </div>
  )
}
