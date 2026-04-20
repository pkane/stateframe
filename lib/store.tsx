'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { AppState, ZoomLevel, PinnedState } from './types'
import { MAX_PINNED_STATES } from './constants'

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: AppState = {
  zoomLevel:       'overview',
  activeVariant:   null,
  activeState:     null,
  pinnedStates:    [],
  hiddenStates:    [],
  splitView:       false,
  splitViewIndex:  0,
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ZOOM_TO_COMPONENT'; variantId: string }
  | { type: 'ZOOM_TO_STATE';     stateId: string }
  | { type: 'ZOOM_OUT' }
  | { type: 'ZOOM_TO_OVERVIEW' }
  | { type: 'PIN_STATE';         pinned: PinnedState }
  | { type: 'UNPIN_STATE';       variantId: string; stateId: string }
  | { type: 'TOGGLE_HIDDEN';     stateId: string }
  | { type: 'TOGGLE_SPLIT_VIEW' }
  | { type: 'SET_SPLIT_INDEX';   index: number }

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ZOOM_TO_COMPONENT':
      return {
        ...state,
        zoomLevel:     'component',
        activeVariant: action.variantId,
        activeState:   null,
        splitView:     false,
      }

    case 'ZOOM_TO_STATE':
      return {
        ...state,
        zoomLevel:   'state-detail',
        activeState: action.stateId,
        splitView:   false,
      }

    case 'ZOOM_TO_OVERVIEW':
      return {
        ...state,
        zoomLevel:     'overview',
        activeVariant: null,
        activeState:   null,
        splitView:     false,
      }

    case 'ZOOM_OUT': {
      if (state.splitView) {
        return { ...state, splitView: false }
      }
      if (state.zoomLevel === 'state-detail') {
        return { ...state, zoomLevel: 'component', activeState: null }
      }
      if (state.zoomLevel === 'component') {
        return { ...state, zoomLevel: 'overview', activeVariant: null }
      }
      return state
    }

    case 'PIN_STATE': {
      if (state.pinnedStates.length >= MAX_PINNED_STATES) return state
      const already = state.pinnedStates.some(
        p => p.variantId === action.pinned.variantId && p.stateId === action.pinned.stateId
      )
      if (already) return state
      return { ...state, pinnedStates: [...state.pinnedStates, action.pinned] }
    }

    case 'UNPIN_STATE':
      return {
        ...state,
        pinnedStates: state.pinnedStates.filter(
          p => !(p.variantId === action.variantId && p.stateId === action.stateId)
        ),
      }

    case 'TOGGLE_HIDDEN':
      return {
        ...state,
        hiddenStates: state.hiddenStates.includes(action.stateId)
          ? state.hiddenStates.filter(id => id !== action.stateId)
          : [...state.hiddenStates, action.stateId],
      }

    case 'TOGGLE_SPLIT_VIEW':
      return { ...state, splitView: !state.splitView }

    case 'SET_SPLIT_INDEX':
      return { ...state, splitViewIndex: action.index }

    default:
      return state
  }
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

const StateContext    = createContext<AppState | null>(null)
const DispatchContext = createContext<React.Dispatch<Action> | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useAppState(): AppState {
  const ctx = useContext(StateContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}

export function useAppDispatch() {
  const ctx = useContext(DispatchContext)
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider')
  return ctx
}

// Convenience action creators
export function useZoomActions() {
  const dispatch = useAppDispatch()
  return {
    zoomToComponent: useCallback((variantId: string) =>
      dispatch({ type: 'ZOOM_TO_COMPONENT', variantId }), [dispatch]),
    zoomToState: useCallback((stateId: string) =>
      dispatch({ type: 'ZOOM_TO_STATE', stateId }), [dispatch]),
    zoomOut: useCallback(() =>
      dispatch({ type: 'ZOOM_OUT' }), [dispatch]),
    pinState: useCallback((pinned: PinnedState) =>
      dispatch({ type: 'PIN_STATE', pinned }), [dispatch]),
    unpinState: useCallback((variantId: string, stateId: string) =>
      dispatch({ type: 'UNPIN_STATE', variantId, stateId }), [dispatch]),
    toggleHidden: useCallback((stateId: string) =>
      dispatch({ type: 'TOGGLE_HIDDEN', stateId }), [dispatch]),
    toggleSplitView: useCallback(() =>
      dispatch({ type: 'TOGGLE_SPLIT_VIEW' }), [dispatch]),
    setSplitIndex: useCallback((index: number) =>
      dispatch({ type: 'SET_SPLIT_INDEX', index }), [dispatch]),
  }
}

export type { ZoomLevel, AppState, Action }
