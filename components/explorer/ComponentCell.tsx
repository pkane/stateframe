'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { ComponentVariant } from '@/lib/types'


type ComponentCellProps = {
  variant: ComponentVariant
  onClick?: () => void
  targetOpacity?: number
  zoomLevel?: 'overview' | 'component' | 'state-detail'
}

export const ComponentCell = forwardRef<HTMLDivElement, ComponentCellProps>(
  function ComponentCell({ variant, onClick, targetOpacity = 1, zoomLevel }, ref) {
    const Component = variant.component
    const props = variant.defaultProps ?? {}
    const hoverTranslateClass = zoomLevel === 'overview' ? 'lg:group-hover:-translate-y-5' : 'lg:group-hover:-translate-y-[30px]'
    return (
      <motion.div
        ref={ref}
        role="button"
        tabIndex={targetOpacity >= 0.5 ? 0 : -1}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
        className="group flex flex-col items-center gap-4 cursor-pointer outline-none w-fit"
        aria-label={`Explore ${variant.label} states`}
        animate={{ opacity: targetOpacity }}
        whileHover={targetOpacity > 0 && targetOpacity < 1 ? { opacity: 1 } : undefined}
        transition={{ opacity: { duration: 0.4 } }}
      >
        {/* Glow circle */}
        <div className="relative flex w-52 h-32 items-center justify-center">

          <div
            className="absolute inset-0 rounded-full transition-transform duration-500 ease-out pointer-events-none"
          />

          {/* Hover/focus glow — wider radius, brighter, fades in */}
          <div
            className="absolute -inset-5 rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ebebeb 0%, transparent 65%)', transform: 'scale(2)' }}
          />

          {/* Focus ring */}
          <div className="absolute inset-4 rounded-md opacity-0 group-focus-visible:opacity-100 ring-2 ring-neutral-400 ring-offset-2 ring-offset-[#fafafa]" />

          {/* Component preview — inert prevents internal elements from receiving tab focus */}
          <div className="relative pointer-events-none scale-[0.78] origin-center" aria-hidden inert>
            <Component {...props} />
          </div>
        </div>

        {/* Label */}
        <span className={`text-xs text-neutral-400 font-medium tracking-wide lg:opacity-0 -translate-y-8 lg:-translate-y-12 lg:group-hover:opacity-100 ${hoverTranslateClass} group-hover:text-neutral-600 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:text-neutral-600 transition-all duration-300 ease-out`}>
          {variant.label}
        </span>
      </motion.div>
    )
  }
)
