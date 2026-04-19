'use client'

import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { componentRegistry } from '@/lib/registry'
import { ENTRANCE_EASING } from '@/lib/constants'
import { AppProvider, useAppState, useAppDispatch } from '@/lib/store'
import { Breadcrumb } from './Breadcrumb'
import { ComponentCell } from './ComponentCell'

// ─── Inner canvas (has access to store) ──────────────────────────────────────

function CanvasInner() {
  const { zoomLevel, activeVariant, splitView } = useAppState()
  const dispatch = useAppDispatch()

  const canGoBack = zoomLevel !== 'overview' || splitView

  // Zoom-in actions — update store and push a history entry
  const zoomToComponent = useCallback((variantId: string) => {
    dispatch({ type: 'ZOOM_TO_COMPONENT', variantId })
    history.pushState({ zoomLevel: 'component', variantId }, '')
  }, [dispatch])

  // Escape — delegates to history.back() so it's identical to the browser button.
  // popstate (below) owns the actual ZOOM_OUT dispatch.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && canGoBack) history.back()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canGoBack])

  // Back button and Escape both land here
  useEffect(() => {
    function onPopState() {
      dispatch({ type: 'ZOOM_OUT' })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [dispatch])

  // Claim the initial history slot so back never navigates away from the app
  useEffect(() => {
    history.replaceState({ zoomLevel: 'overview' }, '')
  }, [])

  // Derive breadcrumb labels from active variant id
  const activeVariantLabel = activeVariant
    ? componentRegistry.flatMap(g => g.variants).find(v => v.id === activeVariant)?.label ?? null
    : null

  return (
    <div className="relative h-full w-full overflow-auto bg-[#fafafa]">
      <Breadcrumb
        variant={activeVariantLabel}
        onNavigateHome={() => { if (canGoBack) history.back() }}
        onNavigateVariant={() => { if (zoomLevel === 'state-detail') history.back() }}
      />

      {/* Overview grid — visible at level 1 */}
      {zoomLevel === 'overview' && (
        <main
          className="mx-auto max-w-5xl px-10 pt-24 pb-20"
          role="main"
          aria-label="Component overview"
        >
          <div className="flex flex-col gap-16">
            {componentRegistry.map((group, groupIndex) => (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <motion.h2
                  id={`group-${group.id}`}
                  className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: ENTRANCE_EASING }}
                >
                  {group.label}
                </motion.h2>

                <div className="flex flex-wrap gap-4">
                  {group.variants.map((variant, variantIndex) => (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: ENTRANCE_EASING,
                        delay: 0.5 + groupIndex * 0.3 + variantIndex * 0.15,
                      }}
                    >
                      <ComponentCell
                        variant={variant}
                        onClick={() => zoomToComponent(variant.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      )}

      {/* Level 2 and 3 rendered in later steps */}
    </div>
  )
}

// ─── Canvas (owns the provider) ──────────────────────────────────────────────

export function Canvas() {
  return (
    <AppProvider>
      <CanvasInner />
    </AppProvider>
  )
}
