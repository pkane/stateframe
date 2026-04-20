'use client'

import { cn } from '@/lib/utils'

type TextInputProps = {
  placeholder?: string
  value?: string
  label?: string
  errorMessage?: string
  className?: string
}

export function TextInput({
  placeholder = 'Placeholder',
  value,
  label = 'Label',
  errorMessage = 'This field is required',
  className = '',
}: TextInputProps) {
  const isFocused  = className.includes('is-focused')
  const isFilled   = className.includes('is-filled')
  const isError    = className.includes('is-error')
  const isDisabled = className.includes('is-disabled')

  const displayValue = isFilled ? (value ?? 'Filled value') : undefined

  return (
    <div className={cn('flex flex-col gap-1.5 w-48', isDisabled && 'opacity-40')}>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={displayValue}
        disabled={isDisabled}
        className={cn(
          'h-9 rounded-md border px-3 text-sm bg-white text-neutral-900 outline-none transition-colors duration-150',
          'placeholder:text-neutral-400',
          isError   ? 'border-red-500' : 'border-neutral-300',
          !isError && 'hover:border-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10',
          isError  && 'focus:ring-2 focus:ring-red-500/20',
          isFocused && !isError && 'border-neutral-900 ring-2 ring-neutral-900/10',
          isFocused && isError  && 'ring-2 ring-red-500/20',
        )}
        aria-label={label}
        aria-invalid={isError}
      />
      {isError && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
