/**
 * Application State Management
 * Handles persistence, import, and export of user settings and repertoires
 */

export interface Theme {
  name: string
  background: string
  foreground: string
  accent: string
  cardBackground: string
}

export interface BoardPreferences {
  lightSquareColor: string
  darkSquareColor: string
  boardSize: number
  theme: string // theme name
}

export type Perspective = 'white' | 'black'

export interface Repertoire {
  id: string
  name: string
  perspective: Perspective
  openings: string[]
  // Future: Add more fields as repertoire features are developed
}

export interface AppState {
  version: string
  preferences: BoardPreferences
  repertoires: Repertoire[]
  lastModified: string
}

// Built-in themes
export const THEMES: Record<string, Theme> = {
  calico: {
    name: 'Calico',
    background: 'linear-gradient(135deg, #f4e4d7 0%, #e8d5c4 25%, #d4a574 50%, #8b6f47 75%, #5a4a3a 100%)',
    foreground: '#2c1810',
    accent: '#d4a574',
    cardBackground: 'rgba(244, 228, 215, 0.95)'
  },
  blue: {
    name: 'Blue',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    foreground: '#1a1a1a',
    accent: '#4a90e2',
    cardBackground: 'rgba(255, 255, 255, 0.95)'
  },
  dark: {
    name: 'Dark',
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    foreground: '#ffffff',
    accent: '#667eea',
    cardBackground: 'rgba(60, 60, 60, 0.95)'
  },
  forest: {
    name: 'Forest',
    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    foreground: '#1a1a1a',
    accent: '#71b280',
    cardBackground: 'rgba(255, 255, 255, 0.95)'
  }
}

const DEFAULT_STATE: AppState = {
  version: '1.0.0',
  preferences: {
    lightSquareColor: '#f0d9b5',
    darkSquareColor: '#b58863',
    boardSize: 480,
    theme: 'calico'
  },
  repertoires: [],
  lastModified: new Date().toISOString()
}

const STORAGE_KEY = 'calicoChessState'

/**
 * Load state from localStorage
 */
export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as AppState
      // Validate and merge with defaults to handle version changes
      return {
        ...DEFAULT_STATE,
        ...parsed,
        preferences: {
          ...DEFAULT_STATE.preferences,
          ...parsed.preferences
        }
      }
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
  }
  return DEFAULT_STATE
}

/**
 * Save state to localStorage
 */
export function saveState(state: AppState): void {
  try {
    const stateToSave = {
      ...state,
      lastModified: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave, null, 2))
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
    throw new Error('Failed to save state')
  }
}

/**
 * Update preferences in state
 */
export function updatePreferences(preferences: Partial<BoardPreferences>): void {
  const currentState = loadState()
  const updatedState: AppState = {
    ...currentState,
    preferences: {
      ...currentState.preferences,
      ...preferences
    }
  }
  saveState(updatedState)
}

/**
 * Update theme
 */
export function updateTheme(themeName: string): void {
  if (!THEMES[themeName]) {
    console.error(`Theme "${themeName}" not found`)
    return
  }
  updatePreferences({ theme: themeName })
}

/**
 * Get current theme
 */
export function getCurrentTheme(state: AppState): Theme {
  return THEMES[state.preferences.theme] || THEMES.calico
}

/**
 * Export state as JSON file
 */
export function exportState(): void {
  try {
    const state = loadState()
    const dataStr = JSON.stringify(state, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `calico-chess-state-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export state:', error)
    throw new Error('Failed to export state')
  }
}

/**
 * Import state from JSON file
 * Returns a promise that resolves when the user selects a file
 */
export function importState(): Promise<AppState> {
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json,.json'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }
        
        try {
          const text = await file.text()
          const importedState = JSON.parse(text) as AppState
          
          // Validate the imported state has required fields
          if (!importedState.preferences || !importedState.version) {
            throw new Error('Invalid state file format')
          }
          
          // Merge with defaults to ensure all fields exist
          const validatedState: AppState = {
            ...DEFAULT_STATE,
            ...importedState,
            preferences: {
              ...DEFAULT_STATE.preferences,
              ...importedState.preferences
            },
            repertoires: importedState.repertoires || []
          }
          
          saveState(validatedState)
          resolve(validatedState)
        } catch (error) {
          console.error('Failed to parse imported file:', error)
          reject(new Error('Invalid JSON file or corrupted state'))
        }
      }
      
      input.oncancel = () => {
        reject(new Error('Import cancelled'))
      }
      
      document.body.appendChild(input)
      input.click()
      document.body.removeChild(input)
    } catch (error) {
      console.error('Failed to import state:', error)
      reject(error)
    }
  })
}

/**
 * Reset state to defaults
 */
export function resetState(): void {
  saveState(DEFAULT_STATE)
}

/**
 * Add a repertoire
 */
export function addRepertoire(repertoire: Repertoire): void {
  const currentState = loadState()
  const updatedState: AppState = {
    ...currentState,
    repertoires: [...currentState.repertoires, repertoire]
  }
  saveState(updatedState)
}

/**
 * Update a repertoire
 */
export function updateRepertoire(id: string, updates: Partial<Repertoire>): void {
  const currentState = loadState()
  const updatedState: AppState = {
    ...currentState,
    repertoires: currentState.repertoires.map(rep =>
      rep.id === id ? { ...rep, ...updates } : rep
    )
  }
  saveState(updatedState)
}

/**
 * Delete a repertoire
 */
export function deleteRepertoire(id: string): void {
  const currentState = loadState()
  const updatedState: AppState = {
    ...currentState,
    repertoires: currentState.repertoires.filter(rep => rep.id !== id)
  }
  saveState(updatedState)
}
