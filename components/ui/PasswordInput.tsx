'use client'

import { cn } from '@/lib/utils'

type PasswordInputProps = {
  placeholder?: string
  label?: string
  errorMessage?: string
  className?: string
}

export function PasswordInput({
  placeholder = 'Password',
  label = 'Password',
  errorMessage = 'Incorrect password',
  className = '',
}: PasswordInputProps) {
  const isFocused  = className.includes('is-focused')
  const isError    = className.includes('is-error')
  const isDisabled = className.includes('is-disabled')

  return (
    <div className={cn('flex flex-col gap-1.5 w-48', isDisabled && 'opacity-40')}>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <div className={cn(
        'flex h-9 items-center rounded-md border bg-white px-3 transition-colors duration-150',
        isError   ? 'border-red-500' : 'border-neutral-300',
        !isError && 'hover:border-neutral-400 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10',
        isError  && 'focus-within:ring-2 focus-within:ring-red-500/20',
        isFocused && !isError && 'border-neutral-900 ring-2 ring-neutral-900/10',
        isFocused && isError  && 'ring-2 ring-red-500/20',
      )}>
        <input
          type="password"
          placeholder={placeholder}
          disabled={isDisabled}
          className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          aria-label={label}
          aria-invalid={isError}
        />
        <button
          type="button"
          className="ml-4 text-neutral-400 hover:text-neutral-600"
          tabIndex={-1}
          aria-label="Toggle password visibility"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
      {isError && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
