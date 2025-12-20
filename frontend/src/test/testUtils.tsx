import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { AppStateProvider } from '../contexts/AppStateContext'
import type { AppState } from '../utils/appState'
import { DEFAULT_STATE } from '../utils/appState'

/**
 * Custom render function that wraps components with AppStateProvider
 * Use this instead of the default render from @testing-library/react
 * 
 * Can be called in two ways:
 * - renderWithProvider(ui) - uses default state
 * - renderWithProvider(ui, partialState) - merges partialState with default state
 */
export function renderWithProvider(
  ui: ReactElement,
  initialState?: Partial<AppState>
) {
  // If custom state is provided, set it in localStorage before rendering
  if (initialState) {
    const mergedState: AppState = {
      ...DEFAULT_STATE,
      ...initialState,
      preferences: {
        ...DEFAULT_STATE.preferences,
        ...(initialState.preferences || {})
      }
    }
    localStorage.setItem('calicoChessState', JSON.stringify(mergedState))
  }

  return render(ui, {
    wrapper: AppStateProvider
  })
}

/**
 * Mock localStorage for tests
 */
export function mockLocalStorage() {
  const storage: Record<string, string> = {}

  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value
    },
    removeItem: (key: string) => {
      delete storage[key]
    },
    clear: () => {
      Object.keys(storage).forEach(key => delete storage[key])
    },
    get length() {
      return Object.keys(storage).length
    },
    key: (index: number) => Object.keys(storage)[index] || null
  }
}

// Setup localStorage mock globally
beforeEach(() => {
  const localStorageMock = mockLocalStorage()
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
})
