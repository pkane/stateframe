import type { ComponentType } from 'react'

export type StateCategory = 'interactive' | 'validation' | 'disabled' | 'loading'

export type ComponentState = {
  id: string
  label: string
  category: StateCategory
  forcedClassName: string
}

export type ComponentVariant = {
  id: string
  label: string
  purpose?: string
  defaultProps?: Record<string, unknown>
  states: ComponentState[]
  component: ComponentType<Record<string, unknown>>
}

export type ComponentGroup = {
  id: string
  label: string
  variants: ComponentVariant[]
}

export type ZoomLevel = 'overview' | 'component' | 'state-detail'

export type PinnedState = {
  variantId: string
  stateId: string
  variantLabel: string
  stateLabel: string
}

export type AppState = {
  zoomLevel: ZoomLevel
  activeVariant: string | null
  activeState: string | null
  pinnedStates: PinnedState[]
  hiddenStates: string[]
  splitView: boolean
  splitViewIndex: number
}
