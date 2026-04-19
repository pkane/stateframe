# Project Guidelines — Stateframe
### Vercel Design Engineer Take-Home

---

## What We're Building

A component state explorer — a canvas-based tool for viewing and comparing all states of a UI component simultaneously. The problem it solves: reviewing component states (default, hover, focus, error, disabled, loading) currently requires toggling between isolated Storybook stories or manually triggering states one at a time. You can never see them side by side, making it slow and error-prone to spot visual inconsistencies.

**The core mental model:** A zoomable canvas. Three zoom levels. Progressive disclosure of complexity. No persistent sidebar — ever.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Animation:** Framer Motion (primary), CSS transitions (secondary)
- **Component libraries:** Radix UI primitives where appropriate, shadcn if needed

---

## Data Model

Three levels in the hierarchy, mapping exactly to three levels in the UI:

```ts
type ComponentGroup = {
  id: string
  label: string
  variants: ComponentVariant[]
}

type ComponentVariant = {
  id: string
  label: string
  defaultProps?: Record<string, any>
  states: ComponentState[]
  component: React.ComponentType<any>
}

type ComponentState = {
  id: string
  label: string
  category: 'interactive' | 'validation' | 'disabled' | 'loading'
  forcedClassName: string
}
```

- `ComponentGroup` → group headers in the overview grid
- `ComponentVariant` → individual cells in the overview grid (default render only)
- `ComponentState` → state cells that deal in at level 2

---

## App State

```ts
type ZoomLevel = 'overview' | 'component' | 'state-detail'

type PinnedState = {
  variantId: string
  stateId: string
  variantLabel: string
  stateLabel: string
}

type AppState = {
  zoomLevel: ZoomLevel
  activeVariant: string | null       // variant id
  activeState: string | null         // state id
  pinnedStates: PinnedState[]        // max ~5 pins
  hiddenStates: string[]             // state ids toggled off via toolbar
  splitView: boolean                 // level 3 only
  splitViewIndex: number             // which pinned state is showing on right
}
```

---

## Zoom Levels — Behavior

### Level 1: Overview
- Full canvas visible
- All component variants rendered at thumbnail scale, default state only
- Grouped by ComponentGroup with quiet group labels
- No toolbar, no sidebar, no persistent chrome
- Single click on a variant cell → zoom to Level 2
- Only UI: wordmark top-left

### Level 2: Component Expanded
- Camera moves toward clicked variant (CSS transform + Framer Motion)
- Surrounding variants scale down and dim to ~40% opacity — still visible, not gone
- States deal in with stagger animation (60ms increments)
- Each state cell shows frozen/forced render of that state
- Contextual floating toolbar appears below the expanded zone:
  - Pill toggles per state (writes to `hiddenStates`)
  - Category filter (interactive / validation / disabled / loading)
  - Density toggle (compact / comfortable)
- Pinned rail appears at top if `pinnedStates.length > 0`
- Pin icon appears on state cell hover (top-right corner)
- Click a state cell → zoom to Level 3
- Escape → back to Level 1

### Level 3: State Detail
- Single state fills most of viewport
- Component is live and fully interactive
- "Live" indicator top-right of cell
- Code drawer at bottom — collapsed by default, pull up to reveal props/classNames
- Pinned rail visible at top if pins exist
- Split view: click pinned thumbnail in rail → splits viewport 50/50
  - Current state always left, pinned state always right
  - `← prev` / `next →` text links below right panel
  - Count indicator between links: `2 of 3 pinned`
  - Escape → collapses split view, stays at Level 3
- Escape → back to Level 2

---

## Navigation

**Escape key:** Always undoes exactly one thing.
- Split view → Level 3 single state
- Level 3 → Level 2
- Level 2 → Level 1

**Breadcrumb (top-left):**
- Level 1: `Stateframe`
- Level 2: `Stateframe / Button · Primary`
- Level 3: `Stateframe / Button · Primary / Hover`
- Each segment is clickable, jumps directly to that level
- Breadcrumb is the only persistent navigation chrome

---

## Animation Principles

The zoom mechanic is the signature interaction. It must feel weighted and confident.

- **Zoom:** CSS transform (scale + translate) on the canvas container, orchestrated with Framer Motion. The camera moves *to* the component — the component does not jump to center.
- **State stagger:** States deal in sequentially, 60ms increments. Default is already present. Others cascade outward.
- **Dimming:** Surrounding variants fade to 40% opacity as zoom settles — slightly lagging behind the zoom itself.
- **Easing:** Spring physics or a custom cubic-bezier with slight overshoot. Weighted, not bouncy. Confident, not snappy.
- **State exit:** `AnimatePresence` handles state cells toggled off via toolbar. Smooth exit, remaining cells reflow.
- **No page transitions.** Everything happens on one continuous surface.

---

## Component Inventory

Variants listed below. Each variant at overview shows default state only.

**Buttons**
- Primary (default, hover, focus, active, disabled, loading)
- Secondary (default, hover, focus, active, disabled)
- Destructive (default, hover, focus, active, disabled)

**Form Inputs**
- Text Input (default, focus, filled, error, disabled)
- Password Input (default, focus, error, disabled)
- Checkbox (unchecked, checked, indeterminate, disabled)
- Select (default, open, filled, error, disabled)

**Feedback**
- Badge · Neutral
- Badge · Success
- Badge · Warning
- Badge · Error

**Navigation**
- Link (default, hover, focus, visited, disabled)

Total: ~13 variant cells in the overview grid. Rich enough to feel like a real system.

---

## Forced State Strategy

States are **frozen renders**, not triggered interactions. Each state cell forces its visual appearance via:
- A persistent class: `.is-hovered`, `.is-focused`, `.is-error` etc.
- Or a `data-state` attribute: `data-state="hover"`
- Hover cell does NOT respond to cursor — it already looks hovered

Exception: **Level 3 detail view** — here the component is fully live and interactive. Cursor, keyboard, everything works normally.

---

## Design Language

- **Aesthetic:** Refined, minimal, design-review artifact — not a dev tool
- **Feel:** Something a designer *and* an engineer would open
- **Typography:** Clean, considered — not monospace-heavy
- **Color:** Neutral surface, muted component backgrounds, subtle state category color coding
- **State labels:** Quiet metadata beneath each cell, never loud
- **Chrome:** Absolute minimum. If a UI element doesn't earn its presence, it doesn't exist.
- **No sidebar. Ever.**

---

## Folder Structure

```
/app
  page.tsx                  — root, renders canvas
  layout.tsx                — minimal shell
/components
  /ui                       — illustrative components (Button, Input, etc.)
  /explorer
    Canvas.tsx              — root canvas, zoom level orchestration
    ComponentCell.tsx       — single variant cell (overview)
    StateCell.tsx           — single state cell (level 2)
    StateToolbar.tsx        — contextual floating toolbar
    PinnedRail.tsx          — pinned states strip
    Breadcrumb.tsx          — top-left navigation
    CodeDrawer.tsx          — bottom drawer at level 3
    SplitView.tsx           — level 3 comparison layout
/lib
  components.ts             — component registry (data)
  types.ts                  — shared TypeScript types
  constants.ts              — stagger timings, easing values, etc.
```

---

## Build Order

1. Scaffold repo, install dependencies (Next.js, Tailwind, Framer Motion, TypeScript)
2. Define types and component registry in `/lib`
3. Build UI components with forced state classes
4. Build overview grid — static, no animation yet
5. Add zoom level state management
6. Wire up Framer Motion animation layer
7. Build Level 2 — state expansion, stagger, toolbar
8. Build Level 3 — detail view, code drawer, live interaction
9. Build pinned rail + split view
10. Breadcrumb + Escape key navigation
11. Polish pass — easing refinement, spacing, typography, empty/loading states

---

## Time Budget (~12 hours)

| Task | Time |
|---|---|
| Setup + architecture | 1h |
| UI components + forced states | 2h |
| Overview grid (static) | 1.5h |
| Zoom state management | 1h |
| Level 2 — expansion + toolbar | 2.5h |
| Level 3 — detail + code drawer | 1.5h |
| Pinned rail + split view | 2h |
| Breadcrumb + Escape nav | 0.5h |
| Polish pass | 1h |
| **Total** | **~13h** |

---

## Write-up Notes (document as you go)

Key decisions to articulate:
- **Film strip vs. playground** — states are frozen renders, not triggered interactions. Deliberate.
- **Progressive disclosure as complexity budget** — each zoom level earns the right to show more
- **No sidebar** — the canvas is the navigation. Absence of sidebar is a design statement.
- **Variants at overview, states at Level 2** — clean separation of hierarchy
- **How it ships** — production version would accept a declarative config file pointing at a team's own component library. Hardcoded set is intentional for prototype scope.

---

## Accessibility Requirements (non-negotiable)

- Full keyboard navigation — Tab, Enter, Escape all work
- Visible focus states at every zoom level
- Semantic HTML throughout
- ARIA labels on interactive elements
- No jank — animations respect `prefers-reduced-motion`

---

## Notes for Claude Code

- Do not invent features not listed here. When in doubt, do less and do it better.
- Animation quality is the highest priority after correctness. The zoom mechanic must feel great.
- Forced state classes live on the UI components themselves — they should be designed into the component, not hacked on from outside.
- The data model in `/lib/types.ts` and `/lib/components.ts` should be built first and treated as the source of truth for everything else.
- Ask before making structural decisions not covered in this document.