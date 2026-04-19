'use client'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

type ButtonProps = {
  children?: React.ReactNode
  variant?: ButtonVariant
  className?: string
  onClick?: () => void
}

export function Button({ children = 'Button', variant = 'primary', className = '', onClick }: ButtonProps) {
  const isHovered    = className.includes('is-hovered')
  const isFocused    = className.includes('is-focused')
  const isActive     = className.includes('is-active')
  const isDisabled   = className.includes('is-disabled')
  const isLoading    = className.includes('is-loading')

  const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-4 transition-none select-none cursor-pointer outline-none'

  const variants: Record<ButtonVariant, string> = {
    primary:     'bg-neutral-900 text-white border border-neutral-900',
    secondary:   'bg-white text-neutral-900 border border-neutral-300',
    destructive: 'bg-red-600 text-white border border-red-600',
  }

  const hovered: Record<ButtonVariant, string> = {
    primary:     'bg-neutral-700 border-neutral-700',
    secondary:   'bg-neutral-50 border-neutral-400',
    destructive: 'bg-red-500 border-red-500',
  }

  const active: Record<ButtonVariant, string> = {
    primary:     'bg-neutral-800 border-neutral-800 scale-[0.98]',
    secondary:   'bg-neutral-100 border-neutral-400 scale-[0.98]',
    destructive: 'bg-red-700 border-red-700 scale-[0.98]',
  }

  const focusRing = 'ring-2 ring-offset-2 ring-neutral-900'

  return (
    <button
      className={cn(
        base,
        variants[variant],
        isHovered  && hovered[variant],
        isActive   && active[variant],
        isFocused  && focusRing,
        isDisabled && 'opacity-40 cursor-not-allowed',
        isLoading  && 'opacity-70 cursor-wait',
      )}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {isLoading && (
        <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
