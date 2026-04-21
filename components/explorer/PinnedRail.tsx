'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { componentRegistry } from '@/lib/registry'
import type { PinnedState, ZoomLevel } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ZOOM_EASING } from '@/lib/constants'

type PinnedRailProps = {
  pinnedStates: PinnedState[]
  zoomLevel: ZoomLevel
  splitView: boolean
  splitViewIndex: number
  onActivate: (index: number) => void
  onUnpin: (variantId: string, stateId: string) => void
}

export function PinnedRail({ pinnedStates, zoomLevel, splitView, splitViewIndex, onActivate, onUnpin }: PinnedRailProps) {
  const canActivate = zoomLevel !== 'overview'

  return (
    <AnimatePresence>
      {pinnedStates.length > 0 && zoomLevel !== 'overview' && (
        <motion.div
          className="fixed top-[80px] md:top-[18px] right-8 z-50 flex items-center gap-2.5"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: ZOOM_EASING }}
          role="group"
          aria-label="Pinned states"
        >
          {pinnedStates.map((pin, index) => {
            const variant = componentRegistry.flatMap(g => g.variants).find(v => v.id === pin.variantId)
            const state   = variant?.states.find(s => s.id === pin.stateId)
            if (!variant || !state) return null

            const Component = variant.component
            const props     = variant.defaultProps ?? {}
            const isActive  = splitView && splitViewIndex === index

            return (
              <motion.div
                key={`${pin.variantId}-${pin.stateId}`}
                className="group relative"
                initial={{ opacity: 0, scale: 0.85, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 10 }}
                transition={{ duration: 0.2, ease: ZOOM_EASING }}
                layout
              >
                <div
                  role={canActivate ? 'button' : undefined}
                  tabIndex={canActivate ? 0 : -1}
                  onClick={() => canActivate && onActivate(index)}
                  onKeyDown={(e) => { if (canActivate && (e.key === 'Enter' || e.key === ' ')) onActivate(index) }}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
                    canActivate ? 'cursor-pointer' : 'cursor-default',
                  )}
                  aria-label={zoomLevel === 'state-detail' ? `Compare with ${pin.variantLabel} · ${pin.stateLabel}` : `Go to ${pin.variantLabel} · ${pin.stateLabel}`}
                  aria-pressed={canActivate ? isActive : undefined}
                >
                  <div
                    className={cn(
                      'relative w-14 h-9 md:w-24 h-14 rounded-md bg-white overflow-hidden transition-all duration-150',
                      isActive
                        ? 'ring-2 ring-neutral-900 shadow-sm'
                        : canActivate
                        ? 'ring-1 ring-neutral-200 hover:ring-neutral-400'
                        : 'ring-1 ring-neutral-200',
                    )}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[0.35] origin-center"
                      aria-hidden
                      inert
                    >
                      <Component {...props} className={state.forcedClassName} />
                    </div>
                  </div>
                  <span className="text-[9px] font-medium text-neutral-400 leading-none">{pin.stateLabel}</span>
                </div>

                {/* Unpin button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onUnpin(pin.variantId, pin.stateId) }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                  aria-label={`Unpin ${pin.variantLabel} · ${pin.stateLabel}`}
                  tabIndex={-1}
                >
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
