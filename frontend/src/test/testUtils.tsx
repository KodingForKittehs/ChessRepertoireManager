import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { AppStateProvider } from '../contexts/AppStateContext'

/**
 * Custom render function that wraps components with AppStateProvider
 * Use this instead of the default render from @testing-library/react
 */
export function renderWithProvider(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: AppStateProvider,
    ...options
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
