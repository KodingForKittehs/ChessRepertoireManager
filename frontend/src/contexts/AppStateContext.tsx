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
  selectRepertoire,
  updateSwapBoardExplorer as persistUpdateSwap
  ,
  updateLockWindowResizing as persistUpdateLock
} from '../utils/appState'

interface AppStateContextType {
  state: AppState
  currentTheme: Theme
  updateLightSquareColor: (color: string) => void
  updateDarkSquareColor: (color: string) => void
  updateBoardSize: (size: number) => void
  updateTheme: (themeName: string) => void
  updateSwapBoardExplorer: (swap: boolean) => void
  updateBoardOrientation: (orientation: 'white' | 'black') => void
  updateMoveExplorerDimensions: (width: number, height: number) => void
  updateLockWindowResizing: (locked: boolean) => void
  addRepertoire: (name: string, perspective: 'white' | 'black') => void
  updateRepertoire: (id: string, updates: Partial<Omit<Repertoire, 'id'>>) => void
  deleteRepertoire: (id: string) => void
  selectRepertoire: (id: string | null, mode: RepertoireMode | null) => void
  navigateToPosition: (nodeId: string) => void
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

  const updateBoardOrientation = (orientation: 'white' | 'black') => {
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        boardOrientation: orientation
      }
    }))
  }

  const updateSwapBoardExplorer = (swap: boolean) => {
    // Persist via helper so localStorage is kept in sync
    persistUpdateSwap(swap)
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        swapBoardExplorer: swap
      }
    }))
  }

  const updateLockWindowResizing = (locked: boolean) => {
    // Persist via helper so localStorage is kept in sync
    persistUpdateLock(locked)
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        lockWindowResizing: locked
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
    setState(prev => {
      // Find the repertoire to get its root node
      const repertoire = prev.repertoires.find(rep => rep.id === id);
      // If repertoire has a perspective, set board orientation accordingly
      const orientation = repertoire?.perspective || prev.preferences.boardOrientation || 'white'
      return {
        ...prev,
        selectedRepertoireId: id,
        repertoireMode: mode,
        currentPositionNodeId: repertoire?.rootNodeId || null,
        preferences: {
          ...prev.preferences,
          boardOrientation: orientation
        }
      };
    });
  }

  const navigateToPosition = (nodeId: string) => {
    setState(prev => ({
      ...prev,
      currentPositionNodeId: nodeId
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
        updateSwapBoardExplorer,
        updateBoardOrientation,
        updateMoveExplorerDimensions,
        updateLockWindowResizing,
        addRepertoire,
        updateRepertoire,
        deleteRepertoire,
        selectRepertoire: handleSelectRepertoire,
        navigateToPosition,
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
