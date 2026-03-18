/**
 * PURPOSE: Placeholder page for Question Engine module
 * OUTPUTS: Empty state with module description and phase indicator
 * RELATIONSHIPS: Linked from sidebar navigation
 */

import { MessageSquare } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { MODULE_DESCRIPTIONS } from '@/lib/constants'

export default function QuestionsPage() {
  const mod = MODULE_DESCRIPTIONS['/questions']
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={<MessageSquare size={48} />}
        title="Question Engine"
        description={mod.description}
        ctaLabel={`Coming in Phase ${mod.phase}`}
      />
    </div>
  )
}
