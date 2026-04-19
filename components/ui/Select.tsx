'use client'

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

  const displayValue = isFilled ? OPTIONS[0] : undefined

  return (
    <div className={cn('flex flex-col gap-1.5 w-48', isDisabled && 'opacity-40')}>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <div className="relative">
        <button
          type="button"
          disabled={isDisabled}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border bg-white px-3 text-sm outline-none transition-none',
            displayValue ? 'text-neutral-900' : 'text-neutral-400',
            isError ? 'border-red-500' : 'border-neutral-300',
            isOpen && !isError && 'border-neutral-900 ring-2 ring-neutral-900/10',
            isOpen && isError  && 'ring-2 ring-red-500/20',
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label}
          aria-invalid={isError}
        >
          <span>{displayValue ?? placeholder}</span>
          <svg
            className={cn('size-4 text-neutral-400 transition-none', isOpen && 'rotate-180')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute top-full z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white py-1 shadow-md"
            aria-label={label}
          >
            {OPTIONS.map((opt, i) => (
              <li
                key={opt}
                role="option"
                aria-selected={i === 0}
                className={cn(
                  'px-3 py-1.5 text-sm cursor-pointer',
                  i === 0 ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-700 hover:bg-neutral-50',
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
