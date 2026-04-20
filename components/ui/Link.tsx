'use client'

import { cn } from '@/lib/utils'

type LinkProps = {
  children?: React.ReactNode
  href?: string
  className?: string
}

export function Link({ children = 'Link text', href = '#', className = '' }: LinkProps) {
  const isHovered  = className.includes('is-hovered')
  const isFocused  = className.includes('is-focused')
  const isVisited  = className.includes('is-visited')
  const isDisabled = className.includes('is-disabled')

  return (
    <a
      href={isDisabled ? undefined : href}
      aria-disabled={isDisabled}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 outline-none transition-colors duration-150',
        isDisabled ? 'text-neutral-400 cursor-not-allowed no-underline pointer-events-none'
          : isVisited  ? 'text-purple-700 hover:text-purple-900'
          : isHovered  ? 'text-neutral-500'
          : 'text-neutral-900 hover:text-neutral-500',
        !isDisabled && 'focus-visible:rounded focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
        isFocused && !isDisabled && 'rounded ring-2 ring-neutral-900 ring-offset-2',
      )}
      tabIndex={isDisabled ? -1 : undefined}
    >
      {children}
    </a>
  )
}
