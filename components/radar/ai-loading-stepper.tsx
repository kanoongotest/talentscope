/**
 * PURPOSE: Multi-step loading indicator for AI operations
 * INPUTS: Array of step labels
 * OUTPUTS: Animated stepper that progresses through steps on a timer
 * RELATIONSHIPS: Used by bleed-score-panel, enrichment-panel, strategy-brief-panel
 */

'use client'

import { useEffect, useState } from 'react'

interface Props {
  steps: string[]
}

export function AiLoadingStepper({ steps }: Props) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (activeStep >= steps.length - 1) return
    const timer = setTimeout(() => setActiveStep((s) => s + 1), 1500)
    return () => clearTimeout(timer)
  }, [activeStep, steps.length])

  return (
    <div className="py-6 space-y-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= activeStep ? 'bg-[#185CE3]' : 'bg-gray-200'
            } ${i === activeStep ? 'animate-pulse' : ''}`}
          />
          <span
            className={`text-sm transition-colors ${
              i <= activeStep ? 'text-gray-700' : 'text-gray-300'
            } ${i === activeStep ? 'font-medium' : ''}`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  )
}
