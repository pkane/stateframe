// Mirror of CSS custom properties in globals.css.
// JS animation (Framer Motion) reads from here; CSS reads from :root vars.

export const ZOOM_DURATION_MS = 500

// Sharp ease-out — used for zoom/camera moves
export const ZOOM_EASING = [0.22, 1, 0.36, 1] as const

// Smooth ease-in-out — used for entrance animations
export const ENTRANCE_EASING = [0.65, 0, 0.35, 1] as const

export const ZOOM_SPRING = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 32,
  mass: 1,
}

// Canvas scale target for Level 2 (component expanded)
export const ZOOM_COMPONENT_SCALE = 1.8

export const STATE_STAGGER_MS = 60

export const DIM_OPACITY = 0.4

export const MAX_PINNED_STATES = 5
