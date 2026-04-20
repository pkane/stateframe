'use client'

import { motion } from 'framer-motion'
import { ZOOM_EASING } from '@/lib/constants'
import type { ComponentState } from '@/lib/types'
import { cn } from '@/lib/utils'

type StateToolbarProps = {
  states: ComponentState[]
  hiddenStates: string[]
  density: 'compact' | 'comfortable'
  onToggleHidden: (stateId: string) => void
  onToggleDensity: () => void
}

export function StateToolbar({
  states, hiddenStates, density, onToggleHidden, onToggleDensity,
}: StateToolbarProps) {
  return (
    <motion.nav
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      aria-label="State controls"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.3, ease: ZOOM_EASING, delay: 0.15 }}
    >
      <div className="flex items-center gap-2.5 p-4 bg-white rounded-md shadow-md border border-neutral-200/80 text-sm font-medium">

        {/* Visibility pills — one per state */}
        <div className="flex items-center gap-3" role="group" aria-label="Toggle state visibility">
          {states.map(state => {
            const isVisible = !hiddenStates.includes(state.id)
            return (
              <button
                key={state.id}
                onClick={() => onToggleHidden(state.id)}
                aria-pressed={isVisible}
                className={cn(
                  'px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer',
                  isVisible
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600',
                )}
              >
                {state.label}
              </button>
            )
          })}
        </div>

        <div className="w-px h-4 bg-neutral-200 shrink-0" aria-hidden />

        <button
          onClick={onToggleDensity}
          className="px-2 py-1 text-neutral-500 hover:text-neutral-900 transition-colors duration-150 cursor-pointer"
        >
          {density === 'comfortable' ? 'Compact' : 'Comfortable'}
        </button>

      </div>
    </motion.nav>
  )
}
