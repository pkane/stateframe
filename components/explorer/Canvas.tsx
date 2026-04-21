'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence, useIsPresent } from 'framer-motion'
import { componentRegistry } from '@/lib/registry'
import { ENTRANCE_EASING, ZOOM_EASING, ZOOM_SPRING, ZOOM_COMPONENT_SCALE } from '@/lib/constants'
import { AppProvider, useAppState, useAppDispatch } from '@/lib/store'

import { cn } from '@/lib/utils'

import { Breadcrumb } from './Breadcrumb'
import { ComponentCell } from './ComponentCell'
import { StateCell } from './StateCell'
import { StateToolbar } from './StateToolbar'
import { CodeDrawer } from './CodeDrawer'
import { PinnedRail } from './PinnedRail'

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

// ─── Level 3 overlay — own component so useIsPresent can detect exit ─────────

const CATEGORY_COLOR: Record<string, string> = {
  interactive: 'bg-blue-400',
  validation:  'bg-red-400',
  disabled:    'bg-neutral-300',
  loading:     'bg-amber-400',
}

type StateDetailOverlayProps = {
  groupLabel:    string
  variant:       import('@/lib/types').ComponentVariant
  state:         import('@/lib/types').ComponentState
  splitView:     boolean
  splitVariant:  import('@/lib/types').ComponentVariant | null
  splitState:    import('@/lib/types').ComponentState   | null
  splitIndex:    number
  splitTotal:    number
  onSplitPrev:   () => void
  onSplitNext:   () => void
}

function StateDetailOverlay({
  groupLabel, variant, state,
  splitView, splitVariant, splitState, splitIndex, splitTotal, onSplitPrev, onSplitNext,
}: StateDetailOverlayProps) {
  const isPresent   = useIsPresent()
  const Component   = variant.component
  const props       = variant.defaultProps ?? {}

  return (
    <motion.div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#fafafa]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: ZOOM_EASING }}
      {...(!isPresent && { inert: true })}
    >
      {/* Content area — animates between single and split width */}
      <motion.div
        className="flex gap-5 h-[75vh] flex-wrap"
        animate={{ width: splitView ? '90vw' : '85vw' }}
        transition={{ duration: 0.45, ease: ZOOM_EASING }}
      >
        {/* ── Primary panel (always shown) ── */}
        <motion.div layout className="relative flex-1 h-full" transition={{ duration: 0.45, ease: ZOOM_EASING }}>
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white ring-1 ring-neutral-300"
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.94 }}
            transition={{ duration: 1, ease: ZOOM_EASING }}
          >
            <div className="flex absolute top-3 left-3.5 items-center gap-3">
              <div className={cn('w-3 h-3 rounded-full', CATEGORY_COLOR[state.category])} />
              <span className="text-sm text-neutral-600 tracking-wide">{state.label}</span>
            </div>
            <div className="absolute top-3 right-3.5 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              <span className="text-sm font-medium text-neutral-600">Live</span>
            </div>
            <div className="absolute bottom-5 left-6 right-6">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  {groupLabel} / {variant.label}
                </p>
                <p className="text-[13px] font-medium text-neutral-700 leading-snug">
                  {state.label} state
                </p>
                {!splitView && variant.purpose && (
                  <p className="text-[11px] text-neutral-400 leading-relaxed max-w-sm mt-0.5">
                    {variant.purpose}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scale-[2] origin-center">
              <Component {...props} className={state.forcedClassName} />
            </div>
          </div>
        </motion.div>
        
        {/* ── Split panel (right side) ── */}
        <AnimatePresence>
          {splitView && splitVariant && splitState && (
            <motion.div
              key="split-panel"
              className="relative flex-1 h-full flex flex-col gap-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35, ease: ZOOM_EASING }}
            >
              {/* Card */}
              <div className="relative flex-1">
                <div className="absolute inset-0 rounded-2xl bg-white ring-1 ring-neutral-300">
                  <div className="flex absolute top-3 left-3.5 items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', CATEGORY_COLOR[splitState.category])} />
                    <span className="text-sm text-neutral-600 tracking-wide">{splitState.label}</span>
                  </div>
                  <div className="absolute bottom-5 left-6 right-6">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      {splitVariant.label} / {splitState.label}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="scale-[2] origin-center">
                    <splitVariant.component {...(splitVariant.defaultProps ?? {})} className={splitState.forcedClassName} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Split navigation — lives outside the panels so it doesn't constrain their height */}
      <AnimatePresence>
        {splitView && splitVariant && splitState && (
          <motion.div
            key="split-nav"
            className="flex w-[90vw] justify-end mt-3"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: ZOOM_EASING }}
          >
            <div className="flex w-1/2 items-center justify-between text-[11px] text-neutral-400 px-1">
              <button
                onClick={onSplitPrev}
                className="flex items-center gap-1 hover:text-neutral-700 transition-colors duration-150 cursor-pointer"
                aria-label="Previous pinned state"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="15 18 9 12 15 6" /></svg>
                prev
              </button>
              <span>{splitIndex + 1} of {splitTotal} pinned</span>
              <button
                onClick={onSplitNext}
                className="flex items-center gap-1 hover:text-neutral-700 transition-colors duration-150 cursor-pointer"
                aria-label="Next pinned state"
              >
                next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CodeDrawer
        variant={variant}
        state={state}
        splitView={splitView}
        splitVariant={splitVariant}
        splitState={splitState}
      />
    </motion.div>
  )
}

// ─── Inner canvas ─────────────────────────────────────────────────────────────

function CanvasInner() {
  const { zoomLevel, activeVariant, activeState, splitView, splitViewIndex, hiddenStates, pinnedStates } = useAppState()
  const dispatch = useAppDispatch()

  const containerRef = useRef<HTMLDivElement>(null)
  const cellRefs     = useRef<Map<string, HTMLDivElement>>(new Map())

  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>(IDENTITY)
  const canvasTransformRef = useRef<CanvasTransform>(IDENTITY)
  // Keep ref in sync so callbacks always read the latest value without re-creating
  canvasTransformRef.current = canvasTransform

  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact')

  // Responsive zoom scale: desktop 1.8 → tablet 1.6 → phone 1.4
  const [zoomScale, setZoomScale] = useState(ZOOM_COMPONENT_SCALE)
  const [viewportWidth, setViewportWidth] = useState(1440)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setViewportWidth(w)
      if (w < 768)       setZoomScale(1.4)
      else if (w < 1024) setZoomScale(1.6)
      else               setZoomScale(ZOOM_COMPONENT_SCALE)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const [activeCellNaturalPos, setActiveCellNaturalPos] = useState<{ cx: number; cy: number } | null>(null)

  const canGoBack = zoomLevel !== 'overview' || splitView

  // Reset camera when returning to overview
  useEffect(() => {
    if (zoomLevel === 'overview') setCanvasTransform(IDENTITY)
  }, [zoomLevel])

  const [groupScrollX, setGroupScrollX] = useState<Record<string, number>>({})

  const zoomOut = useCallback(() => dispatch({ type: 'ZOOM_OUT' }), [dispatch])

  const scrollGroup = useCallback((groupId: string, direction: 'left' | 'right', variantCount: number) => {
    const rowWidth    = Math.min(viewportWidth, 1024) - 80
    const totalWidth  = variantCount * 208 + (variantCount - 1) * 16
    const maxScroll   = Math.max(0, totalWidth - rowWidth)
    setGroupScrollX(prev => {
      const current = prev[groupId] ?? 0
      const next = direction === 'right'
        ? Math.min(current + 240, maxScroll)
        : Math.max(0, current - 240)
      return { ...prev, [groupId]: next }
    })
  }, [viewportWidth])

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
    setCanvasTransform(centerCell(cellEl, containerEl, zoomScale, current))
    dispatch({ type: 'ZOOM_TO_COMPONENT', variantId })
  }, [dispatch, zoomScale])

  // Escape → ZOOM_OUT; ArrowLeft/Right → prev/next variant at level 2
  useEffect(() => {
    const allVariants = componentRegistry.flatMap(g => g.variants)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canGoBack) {
        (document.activeElement as HTMLElement)?.blur()
        zoomOut()
        return
      }
      if (zoomLevel === 'component' && activeVariant && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault()
        const idx  = allVariants.findIndex(v => v.id === activeVariant)
        const next = e.key === 'ArrowRight' ? allVariants[idx + 1] : allVariants[idx - 1]
        if (next) zoomToComponent(next.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canGoBack, zoomOut, zoomLevel, activeVariant, zoomToComponent])

  // Active variant lookups
  const allFlatVariants    = componentRegistry.flatMap(g => g.variants)
  const activeVariantData  = activeVariant  ? allFlatVariants.find(v => v.id === activeVariant) ?? null : null
  const activeVariantLabel = activeVariantData?.label ?? null
  const activeGroup        = activeVariant  ? componentRegistry.find(g => g.variants.some(v => v.id === activeVariant)) ?? null : null
  const activeGroupId      = activeGroup?.id ?? null
  const activeStateData    = activeState && activeVariantData ? activeVariantData.states.find(s => s.id === activeState) ?? null : null

  // Split view data
  const splitPin         = splitView ? (pinnedStates[splitViewIndex] ?? null) : null
  const splitVariantData = splitPin  ? allFlatVariants.find(v => v.id === splitPin.variantId) ?? null : null
  const splitStateData   = splitPin && splitVariantData ? splitVariantData.states.find(s => s.id === splitPin.stateId) ?? null : null

  const handleSplitActivate = (index: number) => {
    const pin = pinnedStates[index]
    if (!pin) return
    if (zoomLevel === 'state-detail') {
      if (splitView && splitViewIndex === index) {
        dispatch({ type: 'ZOOM_OUT' })
      } else {
        dispatch({ type: 'SET_SPLIT_INDEX', index })
        if (!splitView) dispatch({ type: 'TOGGLE_SPLIT_VIEW' })
      }
    } else {
      // Level 2: jump straight to that state's detail view
      dispatch({ type: 'ZOOM_TO_COMPONENT', variantId: pin.variantId })
      dispatch({ type: 'ZOOM_TO_STATE', stateId: pin.stateId })
    }
  }
  const handleSplitPrev = () =>
    dispatch({ type: 'SET_SPLIT_INDEX', index: (splitViewIndex - 1 + pinnedStates.length) % pinnedStates.length })
  const handleSplitNext = () =>
    dispatch({ type: 'SET_SPLIT_INDEX', index: (splitViewIndex + 1) % pinnedStates.length })

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full overflow-x-hidden bg-[#fafafa]', zoomLevel !== 'overview' && 'overflow-y-hidden' )}
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
          className="mx-auto max-w-5xl pt-24 pb-20"
          role="main"
          aria-label="Component overview"
        >
          <div className="flex flex-col gap-12 md:gap-16">
            {componentRegistry.map((group, groupIndex) => (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <div className="flex items-center justify-between mb-5 px-10">
                  <motion.h2
                    id={`group-${group.id}`}
                    className={`${zoomLevel !== 'overview' && '!opacity-0'} text-[14px] font-semibold uppercase tracking-widest text-neutral-400`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: ENTRANCE_EASING }}
                  >
                    {group.label}
                  </motion.h2>

                  <div className={cn('flex gap-0.5 transition-opacity duration-300', zoomLevel !== 'overview' && 'opacity-0 pointer-events-none')}>
                    {(['left', 'right'] as const).map((dir) => {
                      const rowWidth   = Math.min(viewportWidth, 1024) - 80
                      const totalWidth = group.variants.length * 208 + (group.variants.length - 1) * 16
                      const scrolled   = groupScrollX[group.id] ?? 0
                      const visible    = dir === 'left'
                        ? scrolled > 0
                        : totalWidth - scrolled > rowWidth
                      return (
                        <button
                          key={dir}
                          onClick={() => scrollGroup(group.id, dir, group.variants.length)}
                          tabIndex={zoomLevel === 'overview' && visible ? 0 : -1}
                          aria-hidden={!visible}
                          className={cn(
                            'p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 transition-all duration-150',
                            !visible && 'opacity-0 pointer-events-none',
                          )}
                          aria-label={`Scroll ${group.label} ${dir}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            {dir === 'left'
                              ? <polyline points="15 18 9 12 15 6" />
                              : <polyline points="9 18 15 12 9 6" />
                            }
                          </svg>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={zoomLevel === 'overview' ? { overflowX: 'clip' } : undefined}>
                <div
                  className="flex gap-4"
                  style={{
                    transform: `translateX(-${groupScrollX[group.id] ?? 0}px)`,
                    transition: `transform 0.4s cubic-bezier(${ZOOM_EASING.join(',')})`,
                  }}
                >
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

                    const baseShift = Math.round(30 / zoomScale)
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
                <div
                  className="flex flex-wrap justify-center gap-3"
                  style={{
                    width: viewportWidth < 768
                      ? Math.round(viewportWidth * 0.85 / zoomScale)
                      : viewportWidth < 1024
                      ? Math.round(viewportWidth * 0.75 / zoomScale)
                      : 400,
                  }}
                >
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

      {/* ── Keyboard hint strip — shown whenever not at overview ── */}
      <AnimatePresence>
        {zoomLevel !== 'overview' && (
          <motion.ul
            className="fixed top-[68px] left-8 z-50 flex flex-col gap-1 list-none"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: ZOOM_EASING, delay: 0.1 }}
            aria-label="Keyboard shortcuts"
          >
            {([
              { key: 'ESC', label: 'Zoom out', showOn: ['component', 'state-detail'] },
              { key: '←',   label: 'Previous', showOn: ['component'] },
              { key: '→',   label: 'Next', showOn: ['component'] },
            ]).filter(({ showOn }) => showOn.includes(zoomLevel)).map(({ key, label }) => (
              <li key={key} className="flex items-center gap-2 text-[11px] text-neutral-400">
                <kbd className="font-mono bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded text-[10px] leading-tight min-w-[28px] text-center">
                  {key}
                </kbd>
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

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

      {/* ── Pinned rail — level 2 + 3 ── */}
      <PinnedRail
        pinnedStates={pinnedStates}
        zoomLevel={zoomLevel}
        splitView={splitView}
        splitViewIndex={splitViewIndex}
        onActivate={handleSplitActivate}
        onUnpin={(variantId, stateId) => dispatch({ type: 'UNPIN_STATE', variantId, stateId })}
      />

      {/* ── Level 3: state detail overlay ── */}
      <AnimatePresence>
        {zoomLevel === 'state-detail' && activeVariantData && activeStateData && (
          <StateDetailOverlay
            key="state-detail"
            groupLabel={activeGroup?.label ?? ''}
            variant={activeVariantData}
            state={activeStateData}
            splitView={splitView}
            splitVariant={splitVariantData}
            splitState={splitStateData}
            splitIndex={splitViewIndex}
            splitTotal={pinnedStates.length}
            onSplitPrev={handleSplitPrev}
            onSplitNext={handleSplitNext}
          />
        )}
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
