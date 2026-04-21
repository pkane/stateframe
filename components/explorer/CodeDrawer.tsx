'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ComponentVariant, ComponentState } from '@/lib/types'

type CodeDrawerProps = {
  variant:      ComponentVariant
  state:        ComponentState
  splitView?:   boolean
  splitVariant?: ComponentVariant | null
  splitState?:  ComponentState   | null
}

function buildSnippet(variant: ComponentVariant): string {
  const name = (variant.component as { displayName?: string; name?: string }).displayName
    ?? variant.component.name
    ?? 'Component'
  const { children, ...rest } = (variant.defaultProps ?? {}) as Record<string, unknown>

  const attrs = Object.entries(rest).map(([k, v]) =>
    typeof v === 'string' ? `${k}="${v}"` : `${k}={${JSON.stringify(v)}}`
  )

  if (children !== undefined) {
    const open = attrs.length ? `<${name}\n  ${attrs.join('\n  ')}\n>` : `<${name}>`
    return `${open}\n  ${children}\n</${name}>`
  }
  return attrs.length ? `<${name}\n  ${attrs.join('\n  ')}\n/>` : `<${name} />`
}

function DrawerPanel({ variant, state }: { variant: ComponentVariant; state: ComponentState }) {
  const [copied, setCopied] = useState(false)
  const props    = variant.defaultProps ?? {}
  const hasClass = !!state.forcedClassName
  const snippet  = buildSnippet(variant)

  const copy = () => {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex gap-12">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">Usage</p>
        <div className="relative">
          <pre className="text-[11px] font-mono text-neutral-600 bg-neutral-50 px-3 py-2.5 rounded-md ring-1 ring-neutral-100 leading-relaxed pr-10 whitespace-pre">
            {snippet}
          </pre>
          <button
            onClick={copy}
            className="absolute top-2 right-2 p-1 rounded text-neutral-300 hover:text-neutral-600 transition-colors duration-150 cursor-pointer"
            aria-label="Copy snippet"
          >
            {copied
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            }
          </button>
        </div>
      </div>

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
  )
}

export function CodeDrawer({ variant, state, splitView, splitVariant, splitState }: CodeDrawerProps) {
  const [open, setOpen] = useState(false)
  const isSplit = splitView && splitVariant && splitState

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
        className="w-full h-11 flex items-center justify-between px-8 text-[14px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors duration-150 cursor-pointer"
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
      {isSplit ? (
        <div className="flex pb-8 pt-1">
          <div className="flex-1 px-8">
            <DrawerPanel variant={variant} state={state} />
          </div>
          <div className="w-px bg-neutral-100 shrink-0 self-stretch" aria-hidden />
          <div className="flex-1 px-8">
            <DrawerPanel variant={splitVariant} state={splitState} />
          </div>
        </div>
      ) : (
        <div className="px-8 pb-8 pt-1">
          <DrawerPanel variant={variant} state={state} />
        </div>
      )}
    </motion.div>
  )
}
