'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ComponentVariant, ComponentState } from '@/lib/types'

type CodeDrawerProps = {
  variant: ComponentVariant
  state: ComponentState
}

export function CodeDrawer({ variant, state }: CodeDrawerProps) {
  const [open, setOpen] = useState(false)
  const props = variant.defaultProps ?? {}
  const hasClass = !!state.forcedClassName

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200/80"
      animate={{ y: open ? 0 : 'calc(100% - 44px)' }}
      initial={false}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      {/* Handle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full h-11 flex items-center justify-between px-8 text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors duration-150"
        aria-expanded={open}
        aria-label="Toggle props drawer"
      >
        <span>Props &amp; classes</span>
        <motion.svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <polyline points="18 15 12 9 6 15" />
        </motion.svg>
      </button>

      {/* Content */}
      <div className="flex gap-12 px-8 pb-8 pt-1">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">Props</p>
          <table className="border-collapse">
            <tbody>
              {Object.entries(props).map(([key, value]) => (
                <tr key={key}>
                  <td className="pr-6 py-[3px] text-[11px] font-medium text-neutral-400">{key}</td>
                  <td className="text-[11px] font-mono text-neutral-600">{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasClass && (
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">Forced class</p>
            <code className="text-[11px] font-mono text-neutral-600 bg-neutral-50 px-2 py-1 rounded-md ring-1 ring-neutral-100">
              .{state.forcedClassName}
            </code>
          </div>
        )}
      </div>
    </motion.div>
  )
}
