import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AppState, Theme, Repertoire, RepertoireMode } from '../utils/appState'
import { 
  loadState, 
  saveState, 
  exportState, 
  importState, 
  resetState, 
  getCurrentTheme, 
  THEMES,
  createEmptyRepertoire,
  selectRepertoire 
} from '../utils/appState'

interface AppStateContextType {
  state: AppState
  currentTheme: Theme
  updateLightSquareColor: (color: string) => void
  updateDarkSquareColor: (color: string) => void
  updateBoardSize: (size: number) => void
  updateTheme: (themeName: string) => void
  updateMoveExplorerDimensions: (width: number, height: number) => void
  addRepertoire: (name: string, perspective: 'white' | 'black') => void
  updateRepertoire: (id: string, updates: Partial<Omit<Repertoire, 'id'>>) => void
  deleteRepertoire: (id: string) => void
  selectRepertoire: (id: string | null, mode: RepertoireMode | null) => void
  exportAppState: () => void
  importAppState: () => Promise<void>
  resetAppState: () => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState())
  const currentTheme = getCurrentTheme(state)

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

  const updateTheme = (themeName: string) => {
    if (!THEMES[themeName]) {
      console.error(`Theme "${themeName}" not found`)
      return
    }
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: themeName
      }
    }))
  }

  const updateMoveExplorerDimensions = (width: number, height: number) => {
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        moveExplorerWidth: width,
        moveExplorerHeight: height
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

  const addRepertoire = (name: string, perspective: 'white' | 'black') => {
    const newRepertoire = createEmptyRepertoire(name, perspective)
    setState(prev => ({
      ...prev,
      repertoires: [...prev.repertoires, newRepertoire]
    }))
  }

  const updateRepertoire = (id: string, updates: Partial<Omit<Repertoire, 'id'>>) => {
    setState(prev => ({
      ...prev,
      repertoires: prev.repertoires.map(rep =>
        rep.id === id ? { ...rep, ...updates, updatedAt: new Date().toISOString() } : rep
      )
    }))
  }

  const deleteRepertoire = (id: string) => {
    setState(prev => ({
      ...prev,
      repertoires: prev.repertoires.filter(rep => rep.id !== id),
      // Clear selection if deleted repertoire was selected
      selectedRepertoireId: prev.selectedRepertoireId === id ? null : prev.selectedRepertoireId,
      repertoireMode: prev.selectedRepertoireId === id ? null : prev.repertoireMode
    }))
  }

  const handleSelectRepertoire = (id: string | null, mode: RepertoireMode | null) => {
    selectRepertoire(id, mode) // Also save to localStorage
    setState(prev => ({
      ...prev,
      selectedRepertoireId: id,
      repertoireMode: mode
    }))
  }

  return (
    <AppStateContext.Provider
      value={{
        state,
        currentTheme,
        updateLightSquareColor,
        updateDarkSquareColor,
        updateBoardSize,
        updateTheme,
        updateMoveExplorerDimensions,
        addRepertoire,
        updateRepertoire,
        deleteRepertoire,
        selectRepertoire: handleSelectRepertoire,
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
