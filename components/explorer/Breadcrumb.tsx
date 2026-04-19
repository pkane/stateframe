'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ZOOM_EASING } from '@/lib/constants'

type BreadcrumbProps = {
  variant?: string | null
  state?: string | null
  onNavigateHome?: () => void
  onNavigateVariant?: () => void
}

export function Breadcrumb({ variant, state, onNavigateHome, onNavigateVariant }: BreadcrumbProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    if (buttonRef.current) {
      setSize({
        w: buttonRef.current.offsetWidth,
        h: buttonRef.current.offsetHeight,
      })
    }
  }, [])

  return (
    <nav
      className="fixed top-6 z-50 w-full flex items-center justify-center gap-1.5 text-sm"
      aria-label="Explorer navigation"
    >
      <div className="relative inline-flex">
        {/* SVG stroke overlay — draws in via pathLength */}
        {size && (
          <svg
            width={size.w}
            height={size.h}
            className="absolute inset-0 pointer-events-none overflow-visible"
            aria-hidden
          >
            <motion.rect
              x="0.5"
              y="0.5"
              width={size.w - 1}
              height={size.h - 1}
              rx="5.5"
              fill="none"
              stroke="#d4d4d4"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: ZOOM_EASING }}
            />
          </svg>
        )}

        <motion.button
          ref={buttonRef}
          onClick={onNavigateHome}
          className="p-2 rounded-md font-semibold text-neutral-900 tracking-tight hover:text-neutral-600 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: ZOOM_EASING }}
        >
          Stateframe
        </motion.button>
      </div>

      {variant && (
        <>
          <span className="text-neutral-300" aria-hidden>/</span>
          <button
            onClick={onNavigateVariant}
            className="text-neutral-500 hover:text-neutral-900 transition-colors outline-none focus-visible:underline"
          >
            {variant}
          </button>
        </>
      )}

      {state && (
        <>
          <span className="text-neutral-300" aria-hidden>/</span>
          <span className="text-neutral-500">{state}</span>
        </>
      )}
    </nav>
  )
}
