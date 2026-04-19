'use client'

import type { ComponentVariant } from '@/lib/types'

type ComponentCellProps = {
  variant: ComponentVariant
  onClick?: () => void
}

export function ComponentCell({ variant, onClick }: ComponentCellProps) {
  const Component = variant.component
  const props = variant.defaultProps ?? {}

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
      className="group flex flex-col items-center gap-4 cursor-pointer outline-none"
      aria-label={`Explore ${variant.label} states`}
    >
      {/* Glow circle */}
      <div className="relative flex w-52 h-32 items-center justify-center">

        {/* Base glow — always present, soft */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-500 ease-out"
          style={{ background: 'radial-gradient(circle, #ebebeb 0%, transparent 65%)' }}
        />

        {/* Hover glow — wider radius, brighter, fades in */}
        <div
          className="absolute -inset-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
          style={{ background: 'radial-gradient(circle, #e2e2e2 0%, transparent 60%)' }}
        />

        {/* Focus ring */}
        <div className="absolute inset-4 rounded-full opacity-0 group-focus-visible:opacity-100 ring-2 ring-neutral-900 ring-offset-2 ring-offset-[#fafafa]" />

        {/* Component preview — pointer-events-none, frozen */}
        <div className="relative pointer-events-none scale-[0.78] origin-center" aria-hidden>
          <Component {...props} />
        </div>
      </div>

      {/* Label */}
      <span className="text-xs text-neutral-400 font-medium tracking-wide opacity-0 -translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-neutral-600 transition-all duration-300 ease-out">
        {variant.label}
      </span>
    </div>
  )
}
