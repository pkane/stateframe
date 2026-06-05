'use client'

import { forwardRef, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ComponentVariant, ComponentState } from '@/lib/types'

function stateDotColor(state: ComponentState): string {
  if (state.forcedClassName === '') return '#3b82f6'
  if (state.category === 'validation') return '#ef4444'
  if (state.category === 'disabled' || state.category === 'loading') return '#525252'
  const lbl = state.label.toLowerCase()
  if (lbl === 'focus' || lbl === 'checked' || lbl === 'filled' || lbl === 'open') return '#22c55e'
  return '#525252'
}

type ComponentCellProps = {
  variant: ComponentVariant
  onClick?: () => void
  targetOpacity?: number
  zoomLevel?: 'overview' | 'component' | 'state-detail'
  entranceDelay?: number
}

export const ComponentCell = forwardRef<HTMLDivElement, ComponentCellProps>(
  function ComponentCell({ variant, onClick, targetOpacity = 1, entranceDelay = 0 }, ref) {
    const Component = variant.component
    const props = variant.defaultProps ?? {}

    const hasEntered = useRef(false)
    useEffect(() => { hasEntered.current = true }, [])

    return (
      <motion.div
        ref={ref}
        role="button"
        tabIndex={targetOpacity >= 0.5 ? 0 : -1}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
        className="group flex flex-1 cursor-pointer outline-none w-fit"
        aria-label={`Explore ${variant.label} states`}
        initial={{ opacity: 0 }}
        animate={{ opacity: targetOpacity }}
        whileHover={targetOpacity > 0 && targetOpacity < 1 ? { opacity: 1 } : undefined}
        transition={{ opacity: { duration: 0.4, delay: hasEntered.current ? 0 : entranceDelay } }}
      >
        <div
          className="relative flex flex-col w-36 md:w-52 rounded-xl overflow-hidden bg-white/60 hover:bg-white ring-1 ring-neutral-300 hover:ring-neutral-400"
        >
          {/* Hover tint */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-300 pointer-events-none z-10" />

          {/* Focus ring */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-focus-visible:opacity-100 ring-2 ring-inset ring-neutral-500 pointer-events-none z-10" />

          {/* Preview area */}
          <div className="flex h-32 items-center justify-center">
            <div className="relative pointer-events-none scale-[0.78] origin-center" aria-hidden inert>
              <Component {...props} />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-grey" />

          {/* Label + state dots */}
          <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-300 transition-colors duration-200">
              {variant.label}
            </span>
            <div className="flex flex-wrap gap-x-2.5 gap-y-1">
              {variant.states.map(state => (
                <div key={state.id} className="flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: stateDotColor(state) }}
                  />
                  <span className="text-[9px] text-neutral-600 leading-none">{state.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }
)
