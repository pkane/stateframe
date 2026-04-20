'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { componentRegistry } from '@/lib/registry'
import { ENTRANCE_EASING, ZOOM_EASING, ZOOM_SPRING, ZOOM_COMPONENT_SCALE } from '@/lib/constants'
import { AppProvider, useAppState, useAppDispatch } from '@/lib/store'

import { cn } from '@/lib/utils'

import { Breadcrumb } from './Breadcrumb'
import { ComponentCell } from './ComponentCell'
import { StateCell } from './StateCell'
import { StateToolbar } from './StateToolbar'
import { CodeDrawer } from './CodeDrawer'

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
  const { zoomLevel, activeVariant, activeState, splitView, hiddenStates, pinnedStates } = useAppState()
  const dispatch = useAppDispatch()

  const containerRef = useRef<HTMLDivElement>(null)
  const cellRefs     = useRef<Map<string, HTMLDivElement>>(new Map())

  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>(IDENTITY)
  const canvasTransformRef = useRef<CanvasTransform>(IDENTITY)
  // Keep ref in sync so callbacks always read the latest value without re-creating
  canvasTransformRef.current = canvasTransform

  const [density, setDensity]               = useState<'compact' | 'comfortable'>('comfortable')

  const [activeCellNaturalPos, setActiveCellNaturalPos] = useState<{ cx: number; cy: number } | null>(null)

  const canGoBack = zoomLevel !== 'overview' || splitView

  // Reset camera when returning to overview
  useEffect(() => {
    if (zoomLevel === 'overview') setCanvasTransform(IDENTITY)
  }, [zoomLevel])

  const zoomOut = useCallback(() => dispatch({ type: 'ZOOM_OUT' }), [dispatch])

  // Zoom into a cell — compute transform, store natural pos for state grid anchoring
  const zoomToComponent = useCallback((variantId: string) => {
    const cellEl      = cellRefs.current.get(variantId)
    const containerEl = containerRef.current
    if (!cellEl || !containerEl) return

    const current   = canvasTransformRef.current
    const cell      = cellEl.getBoundingClientRect()
    const container = containerEl.getBoundingClientRect()

    const visualCx = cell.left - container.left + cell.width  / 2
    const visualCy = cell.top  - container.top  + cell.height / 2
    const naturalCx = (visualCx - current.x) / current.scale
    const naturalCy = (visualCy - current.y) / current.scale

    setActiveCellNaturalPos({ cx: naturalCx, cy: naturalCy })
    setCanvasTransform(centerCell(cellEl, containerEl, ZOOM_COMPONENT_SCALE, current))
    dispatch({ type: 'ZOOM_TO_COMPONENT', variantId })
  }, [dispatch])

  // Escape → ZOOM_OUT
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canGoBack) {
        (document.activeElement as HTMLElement)?.blur()
        zoomOut()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canGoBack, zoomOut])

  // Active variant lookups
  const activeVariantData = activeVariant
    ? componentRegistry.flatMap(g => g.variants).find(v => v.id === activeVariant) ?? null
    : null
  const activeVariantLabel = activeVariantData?.label ?? null
  const activeGroupId = activeVariant
    ? componentRegistry.find(g => g.variants.some(v => v.id === activeVariant))?.id ?? null
    : null
  const activeStateData = activeState && activeVariantData
    ? activeVariantData.states.find(s => s.id === activeState) ?? null
    : null

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#fafafa]"
    >
      <Breadcrumb
        variant={activeVariantLabel}
        state={activeStateData?.label ?? null}
        onNavigateHome={() => {
          if (canGoBack) dispatch({ type: 'ZOOM_TO_OVERVIEW' })
        }}
        onNavigateVariant={() => { if (zoomLevel === 'state-detail') zoomOut() }}
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
                  className={`${zoomLevel !== 'overview' && '!opacity-0'} mb-5 text-[14px] font-semibold uppercase tracking-widest text-neutral-400`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: ENTRANCE_EASING }}
                >
                  {group.label}
                </motion.h2>

                <div className="flex flex-wrap gap-4">
                  {group.variants.map((variant, variantIndex) => {
                    const isActive       = zoomLevel === 'component' && variant.id === activeVariant
                    const isActiveGroup  = zoomLevel === 'component' && group.id === activeGroupId
                    const activeIdxInGrp = isActiveGroup
                      ? group.variants.findIndex(v => v.id === activeVariant)
                      : -1

                    const targetOpacity =
                      zoomLevel !== 'component' ? 1 :
                      isActive ? 0 :
                      isActiveGroup ? 0.5 :
                      0.125

                    const baseShift = Math.round(30 / ZOOM_COMPONENT_SCALE)
                    const distance  = Math.abs(variantIndex - activeIdxInGrp)
                    const translateX =
                      isActiveGroup && !isActive
                        ? baseShift * distance * (variantIndex < activeIdxInGrp ? -1 : 1)
                        : 0

                    const entranceDelay = 0.5 + groupIndex * 0.3 + variantIndex * 0.15

                    return (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, y: 10, x: 0 }}
                      animate={{ opacity: 1, y: 0, x: translateX }}
                      transition={{
                        default: { duration: 0.45, ease: ENTRANCE_EASING, delay: entranceDelay },
                        x: { duration: zoomLevel === 'component' ? 1 : 0.35, ease: ZOOM_EASING, delay: 0 },
                      }}
                    >
                      <ComponentCell
                        ref={(el) => {
                          if (el) cellRefs.current.set(variant.id, el)
                          else cellRefs.current.delete(variant.id)
                        }}
                        variant={variant}
                        targetOpacity={targetOpacity}
                        zoomLevel={zoomLevel}
                        onClick={() => zoomToComponent(variant.id)}
                      />
                    </motion.div>
                  )})}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* ── Level 2: state grid, anchored below the active cell ── */}
        {zoomLevel === 'component' && activeVariantData && activeCellNaturalPos && (() => {
          const visibleStates = activeVariantData.states.filter(s => !hiddenStates.includes(s.id))
          return (
            <div
              style={{
                position: 'absolute',
                top:  activeCellNaturalPos.cy,
                left: activeCellNaturalPos.cx,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AnimatePresence mode="popLayout">
                <div className="flex flex-wrap justify-center gap-3 max-w-[400px]">
                  {visibleStates.map(state => {
                    const originalIndex = activeVariantData.states.findIndex(s => s.id === state.id)
                    return (
                      <StateCell
                        key={state.id}
                        state={state}
                        variant={activeVariantData}
                        index={originalIndex}
                        isPinned={pinnedStates.some(p => p.variantId === activeVariant && p.stateId === state.id)}
                        density={density}
                        onPin={() => dispatch({ type: 'PIN_STATE', pinned: { variantId: activeVariant!, stateId: state.id, variantLabel: activeVariantData.label, stateLabel: state.label } })}
                        onUnpin={() => dispatch({ type: 'UNPIN_STATE', variantId: activeVariant!, stateId: state.id })}
                        onClick={() => dispatch({ type: 'ZOOM_TO_STATE', stateId: state.id })}
                      />
                    )
                  })}
                </div>
              </AnimatePresence>
            </div>
          )
        })()}

        {/* Level 3 slot — added in step 8 */}
      </motion.div>

      {/* ── Level 2 toolbar — fixed in viewport space ── */}
      <AnimatePresence>
        {zoomLevel === 'component' && activeVariantData && (
          <StateToolbar
            key="state-toolbar"
            states={activeVariantData.states}
            hiddenStates={hiddenStates}
            density={density}
            onToggleHidden={(stateId) => dispatch({ type: 'TOGGLE_HIDDEN', stateId })}
            onToggleDensity={() => setDensity(d => d === 'comfortable' ? 'compact' : 'comfortable')}
          />
        )}
      </AnimatePresence>

      {/* ── Level 3: state detail overlay ── */}
      <AnimatePresence>
        {zoomLevel === 'state-detail' && activeVariantData && activeStateData && (() => {
          const Component = activeVariantData.component
          const props = activeVariantData.defaultProps ?? {}
          const categoryColor: Record<string, string> = {
            interactive: 'bg-blue-400',
            validation:  'bg-red-400',
            disabled:    'bg-neutral-300',
            loading:     'bg-amber-400',
          }
          return (
            <motion.div
              key="state-detail"
              className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#fafafa]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: ZOOM_EASING }}
            >
              <div className="relative flex items-center justify-center rounded-2xl bg-white ring-1 ring-neutral-200 w-[85vw] h-[75vh]">
                {/* Category dot */}
                <div className={cn('absolute top-3 left-3.5 w-1.5 h-1.5 rounded-full', categoryColor[activeStateData.category])} />

                {/* Live indicator */}
                <div className="absolute top-2.5 right-3.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                  <span className="text-xs font-medium text-neutral-400">Live</span>
                </div>

                {/* Live component — 2× scale, forced class as floor, real events layer on top */}
                <div className="scale-[2] origin-center">
                  <Component {...props} className={activeStateData.forcedClassName} />
                </div>
              </div>

              <CodeDrawer variant={activeVariantData} state={activeStateData} />
            </motion.div>
          )
        })()}
      </AnimatePresence>
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
