import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadState,
  saveState,
  updatePreferences,
  updateTheme,
  getCurrentTheme,
  resetState,
  addRepertoire,
  updateRepertoire,
  deleteRepertoire,
  selectRepertoire,
  createEmptyRepertoire,
  createInitialRepertoireNode,
  exportState,
  THEMES,
  type AppState,
  type Repertoire
} from './appState'

describe('appState utility', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadState', () => {
    it('returns default state when localStorage is empty', () => {
      const state = loadState()
      
      expect(state.version).toBe('1.0.0')
      expect(state.preferences.lightSquareColor).toBe('#f0d9b5')
      expect(state.preferences.darkSquareColor).toBe('#b58863')
      expect(state.preferences.boardSize).toBe(480)
      expect(state.repertoires).toEqual([])
    })

    it('loads state from localStorage', () => {
      const savedState: AppState = {
        version: '1.0.0',
        preferences: {
          lightSquareColor: '#123456',
          darkSquareColor: '#abcdef',
          boardSize: 640,
          theme: 'calico'
        },
        repertoires: [],
        lastModified: new Date().toISOString()
      }
      localStorage.setItem('calicoChessState', JSON.stringify(savedState))

      const state = loadState()
      expect(state.preferences.lightSquareColor).toBe('#123456')
      expect(state.preferences.darkSquareColor).toBe('#abcdef')
      expect(state.preferences.boardSize).toBe(640)
    })

    it('merges with defaults when loading partial state', () => {
      const partialState = {
        version: '1.0.0',
        preferences: {
          lightSquareColor: '#ffffff'
        }
      }
      localStorage.setItem('calicoChessState', JSON.stringify(partialState))

      const state = loadState()
      expect(state.preferences.lightSquareColor).toBe('#ffffff')
      expect(state.preferences.darkSquareColor).toBe('#b58863') // default
      expect(state.preferences.boardSize).toBe(480) // default
    })

    it('returns defaults on invalid JSON', () => {
      localStorage.setItem('calicoChessState', 'invalid json')

      const state = loadState()
      expect(state.preferences.lightSquareColor).toBe('#f0d9b5')
    })
  })

  describe('saveState', () => {
    it('saves state to localStorage', () => {
      const state: AppState = {
        version: '1.0.0',
        preferences: {
          lightSquareColor: '#ffffff',
          darkSquareColor: '#000000',
          boardSize: 720,
          theme: 'calico'
        },
        repertoires: [],
        lastModified: new Date().toISOString()
      }

      saveState(state)

      const saved = localStorage.getItem('calicoChessState')
      expect(saved).toBeTruthy()
      const parsed = JSON.parse(saved!)
      expect(parsed.preferences.lightSquareColor).toBe('#ffffff')
    })

    it('updates lastModified timestamp', () => {
      const oldDate = new Date('2020-01-01').toISOString()
      const state: AppState = {
        version: '1.0.0',
        preferences: {
          lightSquareColor: '#f0d9b5',
          darkSquareColor: '#b58863',
          boardSize: 480,
          theme: 'calico'
        },
        repertoires: [],
        lastModified: oldDate
      }

      saveState(state)

      const saved = localStorage.getItem('calicoChessState')
      const parsed = JSON.parse(saved!)
      expect(parsed.lastModified).not.toBe(oldDate)
    })
  })

  describe('updatePreferences', () => {
    it('updates light square color', () => {
      updatePreferences({ lightSquareColor: '#123456' })

      const state = loadState()
      expect(state.preferences.lightSquareColor).toBe('#123456')
      expect(state.preferences.darkSquareColor).toBe('#b58863') // unchanged
    })

    it('updates dark square color', () => {
      updatePreferences({ darkSquareColor: '#abcdef' })

      const state = loadState()
      expect(state.preferences.darkSquareColor).toBe('#abcdef')
      expect(state.preferences.lightSquareColor).toBe('#f0d9b5') // unchanged
    })

    it('updates both colors', () => {
      updatePreferences({ 
        lightSquareColor: '#111111',
        darkSquareColor: '#222222'
      })

      const state = loadState()
      expect(state.preferences.lightSquareColor).toBe('#111111')
      expect(state.preferences.darkSquareColor).toBe('#222222')
    })
  })

  describe('resetState', () => {
    it('resets to default state', () => {
      // Set custom state
      updatePreferences({ lightSquareColor: '#123456' })
      
      // Reset
      resetState()

      const state = loadState()
      expect(state.preferences.lightSquareColor).toBe('#f0d9b5')
      expect(state.preferences.darkSquareColor).toBe('#b58863')
    })
  })

  describe('repertoire management', () => {
    it('adds a repertoire', () => {
      const repertoire: Repertoire = {
        id: 'test-1',
        name: 'My Repertoire',
        perspective: 'white',
        rootNodeId: 'initial',
        nodes: {
          initial: {
            id: 'initial',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            moves: [],
            parentMoves: []
          }
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }

      addRepertoire(repertoire)

      const state = loadState()
      expect(state.repertoires).toHaveLength(1)
      expect(state.repertoires[0].name).toBe('My Repertoire')
      expect(state.repertoires[0].perspective).toBe('white')
    })

    it('updates a repertoire', () => {
      const repertoire: Repertoire = {
        id: 'test-1',
        name: 'Original',
        perspective: 'white',
        rootNodeId: 'initial',
        nodes: {
          initial: {
            id: 'initial',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            moves: [],
            parentMoves: []
          }
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      addRepertoire(repertoire)

      updateRepertoire('test-1', { name: 'Updated', perspective: 'black' })

      const state = loadState()
      expect(state.repertoires[0].name).toBe('Updated')
      expect(state.repertoires[0].perspective).toBe('black')
    })

    it('deletes a repertoire', () => {
      const rep1: Repertoire = {
        id: 'test-1',
        name: 'Rep 1',
        perspective: 'white',
        rootNodeId: 'initial',
        nodes: {
          initial: {
            id: 'initial',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            moves: [],
            parentMoves: []
          }
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      const rep2: Repertoire = {
        id: 'test-2',
        name: 'Rep 2',
        perspective: 'black',
        rootNodeId: 'initial',
        nodes: {
          initial: {
            id: 'initial',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            moves: [],
            parentMoves: []
          }
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
      addRepertoire(rep1)
      addRepertoire(rep2)

      deleteRepertoire('test-1')

      const state = loadState()
      expect(state.repertoires).toHaveLength(1)
      expect(state.repertoires[0].id).toBe('test-2')
    })
  })

  describe('exportState', () => {
    it('creates download link', () => {
      // Mock URL.createObjectURL to work in test environment
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
      global.URL.revokeObjectURL = vi.fn()
      
      const createElementSpy = vi.spyOn(document, 'createElement')
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any)
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any)
      
      const mockLink = document.createElement('a')
      const clickSpy = vi.spyOn(mockLink, 'click').mockImplementation(() => {})
      
      createElementSpy.mockReturnValue(mockLink)

      exportState()

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(clickSpy).toHaveBeenCalled()
      
      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })
  })

  describe('updateTheme', () => {
    it('updates theme preference', () => {
      updateTheme('dark')
      
      const state = loadState()
      expect(state.preferences.theme).toBe('dark')
    })

    it('handles invalid theme name', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      updateTheme('nonexistent')
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Theme "nonexistent" not found')
      
      const state = loadState()
      // Should not have updated to invalid theme
      expect(state.preferences.theme).toBe('calico')
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getCurrentTheme', () => {
    it('returns theme for valid theme name', () => {
      const state = loadState()
      state.preferences.theme = 'dark'
      
      const theme = getCurrentTheme(state)
      expect(theme).toBe(THEMES.dark)
      expect(theme.name).toBe('Dark')
    })

    it('returns calico theme as fallback for invalid theme', () => {
      const state = loadState()
      state.preferences.theme = 'invalid-theme' as any
      
      const theme = getCurrentTheme(state)
      expect(theme).toBe(THEMES.calico)
      expect(theme.name).toBe('Calico')
    })
  })

  describe('selectRepertoire', () => {
    it('selects a repertoire with training mode', () => {
      selectRepertoire('rep-123', 'training')
      
      const state = loadState()
      expect(state.selectedRepertoireId).toBe('rep-123')
      expect(state.repertoireMode).toBe('training')
    })

    it('selects a repertoire with editing mode', () => {
      selectRepertoire('rep-456', 'editing')
      
      const state = loadState()
      expect(state.selectedRepertoireId).toBe('rep-456')
      expect(state.repertoireMode).toBe('editing')
    })

    it('deselects repertoire when passed null', () => {
      selectRepertoire('rep-123', 'training')
      selectRepertoire(null, null)
      
      const state = loadState()
      expect(state.selectedRepertoireId).toBeNull()
      expect(state.repertoireMode).toBeNull()
    })
  })

  describe('createEmptyRepertoire', () => {
    it('creates a repertoire with initial node', () => {
      const repertoire = createEmptyRepertoire('Test Opening', 'white')
      
      expect(repertoire.name).toBe('Test Opening')
      expect(repertoire.perspective).toBe('white')
      expect(repertoire.rootNodeId).toBe('initial')
      expect(repertoire.nodes.initial).toBeDefined()
      expect(repertoire.nodes.initial.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
      expect(repertoire.nodes.initial.moves).toEqual([])
      expect(repertoire.id).toMatch(/^rep_/)
      expect(repertoire.createdAt).toBeDefined()
      expect(repertoire.updatedAt).toBeDefined()
    })

    it('creates unique IDs for different repertoires', () => {
      const rep1 = createEmptyRepertoire('Opening 1', 'white')
      const rep2 = createEmptyRepertoire('Opening 2', 'black')
      
      expect(rep1.id).not.toBe(rep2.id)
    })
  })

  describe('createInitialRepertoireNode', () => {
    it('creates initial position node', () => {
      const node = createInitialRepertoireNode()
      
      expect(node.id).toBe('initial')
      expect(node.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
      expect(node.moves).toEqual([])
      expect(node.parentMoves).toEqual([])
      expect(node.comment).toBe('Starting position')
    })
  })

})
