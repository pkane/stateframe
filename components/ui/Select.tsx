'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type SelectProps = {
  placeholder?: string
  label?: string
  errorMessage?: string
  className?: string
}

const OPTIONS = ['Option one', 'Option two', 'Option three']

export function Select({
  placeholder = 'Select an option',
  label = 'Label',
  errorMessage = 'Please select an option',
  className = '',
}: SelectProps) {
  const isOpen     = className.includes('is-open')
  const isFilled   = className.includes('is-filled')
  const isError    = className.includes('is-error')
  const isDisabled = className.includes('is-disabled')

  const [open, setOpen]           = useState(isOpen)
  const [selected, setSelected]   = useState<string | undefined>(isFilled ? OPTIONS[0] : undefined)

  const displayValue = selected

  return (
    <div className={cn('flex flex-col gap-1.5 w-48', isDisabled && 'opacity-40')}>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <div className="relative">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setOpen(o => !o)}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border bg-white px-3 text-sm outline-none transition-colors duration-150',
            displayValue ? 'text-neutral-900' : 'text-neutral-400',
            isError ? 'border-red-500' : 'border-neutral-300',
            !isError && 'hover:border-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10',
            isError  && 'focus:ring-2 focus:ring-red-500/20',
            open && !isError && 'border-neutral-900 ring-2 ring-neutral-900/10',
            open && isError  && 'ring-2 ring-red-500/20',
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          aria-invalid={isError}
        >
          <span>{displayValue ?? placeholder}</span>
          <svg
            className={cn('size-4 text-neutral-400 transition-transform duration-150', open && 'rotate-180')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute top-full z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white py-1 shadow-md"
            aria-label={label}
          >
            {OPTIONS.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={opt === selected}
                onClick={() => { setSelected(opt); setOpen(false) }}
                className={cn(
                  'px-3 py-1.5 text-sm cursor-pointer',
                  opt === selected ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-700 hover:bg-neutral-50',
                )}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isError && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
