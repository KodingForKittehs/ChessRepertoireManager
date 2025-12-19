import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadState,
  saveState,
  updatePreferences,
  resetState,
  addRepertoire,
  updateRepertoire,
  deleteRepertoire,
  exportState,
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
      expect(state.repertoires).toEqual([])
    })

    it('loads state from localStorage', () => {
      const savedState: AppState = {
        version: '1.0.0',
        preferences: {
          lightSquareColor: '#123456',
          darkSquareColor: '#abcdef'
        },
        repertoires: [],
        lastModified: new Date().toISOString()
      }
      localStorage.setItem('calicoChessState', JSON.stringify(savedState))

      const state = loadState()
      expect(state.preferences.lightSquareColor).toBe('#123456')
      expect(state.preferences.darkSquareColor).toBe('#abcdef')
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
          darkSquareColor: '#000000'
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
          darkSquareColor: '#b58863'
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
        openings: ['e4', 'd4']
      }

      addRepertoire(repertoire)

      const state = loadState()
      expect(state.repertoires).toHaveLength(1)
      expect(state.repertoires[0].name).toBe('My Repertoire')
    })

    it('updates a repertoire', () => {
      const repertoire: Repertoire = {
        id: 'test-1',
        name: 'Original',
        openings: []
      }
      addRepertoire(repertoire)

      updateRepertoire('test-1', { name: 'Updated' })

      const state = loadState()
      expect(state.repertoires[0].name).toBe('Updated')
    })

    it('deletes a repertoire', () => {
      const rep1: Repertoire = { id: 'test-1', name: 'Rep 1', openings: [] }
      const rep2: Repertoire = { id: 'test-2', name: 'Rep 2', openings: [] }
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

})
