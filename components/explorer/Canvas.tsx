'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { componentRegistry } from '@/lib/registry'
import { ENTRANCE_EASING, ZOOM_SPRING, ZOOM_COMPONENT_SCALE } from '@/lib/constants'
import { AppProvider, useAppState, useAppDispatch } from '@/lib/store'
import { Breadcrumb } from './Breadcrumb'
import { ComponentCell } from './ComponentCell'

// ─── Transform helpers ────────────────────────────────────────────────────────

type CanvasTransform = { scale: number; x: number; y: number }

const IDENTITY: CanvasTransform = { scale: 1, x: 0, y: 0 }

// Computes x/y/scale so the given cell is centered in the container.
// Uses transformOrigin '0 0': natural point (nx,ny) → visual (nx*s + tx, ny*s + ty).
// getBoundingClientRect() returns the visual (post-transform) position, so we
// inverse-transform it back to natural layout coordinates before solving.
function centerCell(
  cellEl: HTMLElement,
  containerEl: HTMLElement,
  targetScale: number,
  current: CanvasTransform,
): CanvasTransform {
  const cell      = cellEl.getBoundingClientRect()
  const container = containerEl.getBoundingClientRect()

  // Visual position relative to container
  const visualCx = cell.left - container.left + cell.width  / 2
  const visualCy = cell.top  - container.top  + cell.height / 2

  // Inverse-transform → natural layout position
  const naturalCx = (visualCx - current.x) / current.scale
  const naturalCy = (visualCy - current.y) / current.scale

  const vpCx = container.width  / 2
  const vpCy = container.height / 2

  return { scale: targetScale, x: vpCx - naturalCx * targetScale, y: vpCy - naturalCy * targetScale }
}

// ─── Inner canvas ─────────────────────────────────────────────────────────────

function CanvasInner() {
  const { zoomLevel, activeVariant, splitView } = useAppState()
  const dispatch = useAppDispatch()

  const containerRef = useRef<HTMLDivElement>(null)
  const cellRefs     = useRef<Map<string, HTMLDivElement>>(new Map())

  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>(IDENTITY)
  const canvasTransformRef = useRef<CanvasTransform>(IDENTITY)
  // Keep ref in sync so callbacks always read the latest value without re-creating
  canvasTransformRef.current = canvasTransform

  const canGoBack = zoomLevel !== 'overview' || splitView

  // Reset camera when returning to overview
  useEffect(() => {
    if (zoomLevel === 'overview') setCanvasTransform(IDENTITY)
  }, [zoomLevel])

  // Zoom into a cell — compute transform, update store, push history
  const zoomToComponent = useCallback((variantId: string) => {
    const cellEl      = cellRefs.current.get(variantId)
    const containerEl = containerRef.current
    if (!cellEl || !containerEl) return

    setCanvasTransform(centerCell(cellEl, containerEl, ZOOM_COMPONENT_SCALE, canvasTransformRef.current))
    dispatch({ type: 'ZOOM_TO_COMPONENT', variantId })
    history.pushState({ zoomLevel: 'component', variantId }, '')
  }, [dispatch])

  // Escape → history.back(); popstate → ZOOM_OUT
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && canGoBack) history.back() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canGoBack])

  useEffect(() => {
    const onPop = () => dispatch({ type: 'ZOOM_OUT' })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [dispatch])

  useEffect(() => { history.replaceState({ zoomLevel: 'overview' }, '') }, [])

  // Breadcrumb labels
  const activeVariantLabel = activeVariant
    ? componentRegistry.flatMap(g => g.variants).find(v => v.id === activeVariant)?.label ?? null
    : null

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#fafafa]"
    >
      <Breadcrumb
        variant={activeVariantLabel}
        onNavigateHome={() => { if (canGoBack) history.back() }}
        onNavigateVariant={() => { if (zoomLevel === 'state-detail') history.back() }}
      />

      {/* ── Camera — the transformable canvas surface ── */}
      <motion.div
        className="absolute inset-0 origin-top-left"
        animate={canvasTransform}
        transition={ZOOM_SPRING}
      >
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
                        ref={(el) => {
                          if (el) cellRefs.current.set(variant.id, el)
                          else cellRefs.current.delete(variant.id)
                        }}
                        variant={variant}
                        isDimmed={zoomLevel !== 'overview' && variant.id !== activeVariant}
                        onClick={() => zoomToComponent(variant.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* Level 2 and 3 slots — added in steps 7 & 8 */}
      </motion.div>
    </div>
  )
}

// ─── Canvas (owns the provider) ───────────────────────────────────────────────

export function Canvas() {
  return (
    <AppProvider>
      <CanvasInner />
    </AppProvider>
  )
}
