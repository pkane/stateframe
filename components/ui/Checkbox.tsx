'use client'

import { cn } from '@/lib/utils'

type CheckboxProps = {
  label?: string
  className?: string
}

export function Checkbox({ label = 'Checkbox label', className = '' }: CheckboxProps) {
  const isChecked       = className.includes('is-checked')
  const isIndeterminate = className.includes('is-indeterminate')
  const isDisabled      = className.includes('is-disabled')

  const showCheck = isChecked || isIndeterminate

  return (
    <label className={cn('inline-flex items-center gap-2.5 cursor-pointer select-none', isDisabled && 'opacity-40 cursor-not-allowed')}>
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded border transition-none',
          showCheck
            ? 'bg-neutral-900 border-neutral-900'
            : 'bg-white border-neutral-300',
        )}
        role="checkbox"
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        aria-label={label}
        aria-disabled={isDisabled}
      >
        {isChecked && (
          <svg className="size-2.5 text-white" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isIndeterminate && (
          <span className="block h-px w-2 bg-white" aria-hidden />
        )}
      </span>
      <span className="text-sm text-neutral-900">{label}</span>
    </label>
  )
}
