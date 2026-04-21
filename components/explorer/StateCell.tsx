'use client'

import { motion } from 'framer-motion'
import { ENTRANCE_EASING } from '@/lib/constants'
import type { ComponentState, ComponentVariant } from '@/lib/types'
import { cn } from '@/lib/utils'

const CATEGORY_DOT: Record<string, string> = {
  interactive: 'bg-blue-400',
  validation:  'bg-red-400',
  disabled:    'bg-neutral-300',
  loading:     'bg-amber-400',
}

type StateCellProps = {
  state: ComponentState
  variant: ComponentVariant
  index: number
  isPinned: boolean
  density: 'compact' | 'comfortable'
  onPin: () => void
  onUnpin: () => void
  onClick: () => void
}

export function StateCell({ state, variant, index, isPinned, density, onPin, onUnpin, onClick }: StateCellProps) {
  const Component = variant.component
  const props = variant.defaultProps ?? {}
  const isCompact = density === 'compact'

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      className="group relative flex flex-col items-center gap-2 cursor-pointer outline-none"
      aria-label={`View ${state.label} state detail`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, ease: ENTRANCE_EASING, delay: index * 0.06 }}
    >
      <div
        className={cn(
          'relative flex items-center justify-center rounded-md bg-white ring-1 transition-all duration-200 overflow-hidden',
          'ring-neutral-200 group-hover:ring-neutral-400 group-focus-visible:ring-2 group-focus-visible:ring-neutral-900',
          isCompact ? 'w-32 h-18 md:w-36 md:h-20' : 'w-42 h-24',
        )}
      >
        {/* Category dot */}
        <div className={cn('absolute top-2 left-2.5 w-1.5 h-1.5 rounded-full', CATEGORY_DOT[state.category])} />

        {/* Pin button */}
        <button
          onClick={(e) => { e.stopPropagation(); isPinned ? onUnpin() : onPin() }}
          onKeyDown={(e) => e.stopPropagation()}
          className={cn(
            'absolute top-1.5 right-1.5 p-1 rounded-md transition-all duration-150',
            isPinned
              ? 'opacity-100 text-neutral-900'
              : 'opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-900',
          )}
          aria-label={isPinned ? `Unpin ${state.label}` : `Pin ${state.label}`}
          tabIndex={-1}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isPinned ? 2.5 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="12" y1="17" x2="12" y2="22" />
            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
          </svg>
        </button>

        {/* Frozen component preview */}
        <div
          className={cn('pointer-events-none origin-center', isCompact ? 'scale-[0.55]' : 'scale-[0.65]')}
          aria-hidden
          inert
        >
          <Component {...props} className={state.forcedClassName} />
          <span className="block relative -bottom-4 md:hidden text-xs text-center font-medium tracking-wide">{state.label}</span>
        </div>
      </div>

      <span className="hidden md:visible text-xs text-neutral-400 font-medium tracking-wide">{state.label}</span>
    </motion.div>
  )
}
