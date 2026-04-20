'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type CheckboxProps = {
  label?: string
  className?: string
}

export function Checkbox({ label = 'Checkbox label', className = '' }: CheckboxProps) {
  const isChecked       = className.includes('is-checked')
  const isIndeterminate = className.includes('is-indeterminate')
  const isDisabled      = className.includes('is-disabled')
  const isFocused       = className.includes('is-focused')

  const [checked, setChecked] = useState(isChecked)
  const showCheck = checked || isIndeterminate

  return (
    <label className={cn('inline-flex items-center gap-2.5 cursor-pointer select-none group', isDisabled && 'opacity-40 cursor-not-allowed')}>
      <div className="relative size-4 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          disabled={isDisabled}
          aria-label={label}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <span
          className={cn(
            'pointer-events-none flex size-4 items-center justify-center rounded border transition-colors duration-150',
            showCheck ? 'bg-neutral-900 border-neutral-900' : 'bg-white border-neutral-300',
            !showCheck && !isDisabled && 'group-hover:border-neutral-500',
            isFocused && 'ring-2 ring-neutral-900 ring-offset-1',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-900 peer-focus-visible:ring-offset-1',
          )}
          aria-hidden
        >
          <svg className={cn('size-2.5 text-white transition-opacity duration-100', checked && !isIndeterminate ? 'opacity-100' : 'opacity-0')} viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={cn('absolute block h-px w-2 bg-white transition-opacity duration-100', isIndeterminate ? 'opacity-100' : 'opacity-0')} aria-hidden />
        </span>
      </div>
      <span className="text-sm text-neutral-900">{label}</span>
    </label>
  )
}
