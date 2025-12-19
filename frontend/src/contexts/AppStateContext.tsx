import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AppState } from '../utils/appState'
import { loadState, saveState, exportState, importState, resetState } from '../utils/appState'

interface AppStateContextType {
  state: AppState
  updateLightSquareColor: (color: string) => void
  updateDarkSquareColor: (color: string) => void
  updateBoardSize: (size: number) => void
  exportAppState: () => void
  importAppState: () => Promise<void>
  resetAppState: () => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState())

  // Automatically sync to localStorage whenever state changes
  useEffect(() => {
    saveState(state)
  }, [state])

  const updateLightSquareColor = (color: string) => {
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        lightSquareColor: color
      }
    }))
  }

  const updateDarkSquareColor = (color: string) => {
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        darkSquareColor: color
      }
    }))
  }

  const updateBoardSize = (size: number) => {
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        boardSize: size
      }
    }))
  }

  const exportAppState = () => {
    exportState()
  }

  const importAppState = async () => {
    const newState = await importState()
    setState(newState)
  }

  const resetAppState = () => {
    resetState()
    setState(loadState())
  }

  return (
    <AppStateContext.Provider
      value={{
        state,
        updateLightSquareColor,
        updateDarkSquareColor,
        updateBoardSize,
        exportAppState,
        importAppState,
        resetAppState
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

// Custom hook for easy access
export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
