'use client'

import { cn } from '@/lib/utils'

type BadgeTone = 'neutral' | 'success' | 'warning' | 'error'

type BadgeProps = {
  children?: React.ReactNode
  tone?: BadgeTone
  className?: string
}

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  success: 'bg-emerald-50  text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50    text-amber-700   border-amber-200',
  error:   'bg-red-50      text-red-700     border-red-200',
}

export function Badge({ children = 'Badge', tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
