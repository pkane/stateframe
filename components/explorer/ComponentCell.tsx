'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { ComponentVariant } from '@/lib/types'
import { DIM_OPACITY } from '@/lib/constants'

type ComponentCellProps = {
  variant: ComponentVariant
  onClick?: () => void
  isDimmed?: boolean
}

export const ComponentCell = forwardRef<HTMLDivElement, ComponentCellProps>(
  function ComponentCell({ variant, onClick, isDimmed = false }, ref) {
    const Component = variant.component
    const props = variant.defaultProps ?? {}

    return (
      <motion.div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
        className="group flex flex-col items-center gap-4 cursor-pointer outline-none w-fit"
        aria-label={`Explore ${variant.label} states`}
        animate={{ opacity: isDimmed ? DIM_OPACITY : 1 }}
        transition={{ duration: 0.4, delay: isDimmed ? 0.05 : 0 }}
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
        <span className="text-xs text-neutral-400 font-medium tracking-wide opacity-0 -translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-neutral-600 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:text-neutral-600 transition-all duration-300 ease-out">
          {variant.label}
        </span>
      </motion.div>
    )
  }
)
