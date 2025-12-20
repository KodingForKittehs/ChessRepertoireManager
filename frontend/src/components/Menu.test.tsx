import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProvider } from '../test/testUtils'
import Menu from './Menu'

describe('Menu', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders menu buttons', () => {
    renderWithProvider(<Menu />)
    
    expect(screen.getByText('Select Repertoire')).toBeInTheDocument()
    expect(screen.getByText('Manage Repertoires')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('calls onRepertoires when Manage Repertoires button is clicked', () => {
    const mockOnRepertoires = vi.fn()
    renderWithProvider(<Menu onRepertoires={mockOnRepertoires} />)
    
    fireEvent.click(screen.getByText('Manage Repertoires'))
    expect(mockOnRepertoires).toHaveBeenCalledTimes(1)
  })

  it('calls onSettings when Settings button is clicked', () => {
    const mockOnSettings = vi.fn()
    renderWithProvider(<Menu onSettings={mockOnSettings} />)
    
    fireEvent.click(screen.getByText('Settings'))
    expect(mockOnSettings).toHaveBeenCalledTimes(1)
  })

  it('calls onSelectRepertoire when Select Repertoire button is clicked', () => {
    const mockOnSelectRepertoire = vi.fn()
    renderWithProvider(<Menu onSelectRepertoire={mockOnSelectRepertoire} />)
    
    fireEvent.click(screen.getByText('Select Repertoire'))
    expect(mockOnSelectRepertoire).toHaveBeenCalledTimes(1)
  })

  it('shows selected repertoire name and mode when repertoire is selected', () => {
    const initialState = {
      version: '1.0.0',
      preferences: {
        lightSquareColor: '#f0d9b5',
        darkSquareColor: '#b58863',
        boardSize: 480,
        theme: 'calico'
      },
      repertoires: [{
        id: 'rep1',
        name: 'Sicilian Defense',
        perspective: 'black' as const,
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
      }],
      selectedRepertoireId: 'rep1',
      repertoireMode: 'training' as const,
      lastModified: '2023-01-01T00:00:00.000Z'
    }

    localStorage.setItem('calicoChessState', JSON.stringify(initialState))

    renderWithProvider(<Menu />)
    
    expect(screen.getByText('Sicilian Defense')).toBeInTheDocument()
    expect(screen.getByText('🎯 Training')).toBeInTheDocument()
    // The repertoire name is now the button itself, not a separate "Switch Repertoire" button
  })

  it('shows editing mode when repertoire is in editing mode', () => {
    const initialState = {
      version: '1.0.0',
      preferences: {
        lightSquareColor: '#f0d9b5',
        darkSquareColor: '#b58863',
        boardSize: 480,
        theme: 'calico'
      },
      repertoires: [{
        id: 'rep1',
        name: 'French Defense',
        perspective: 'black' as const,
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
      }],
      selectedRepertoireId: 'rep1',
      repertoireMode: 'editing' as const,
      lastModified: '2023-01-01T00:00:00.000Z'
    }

    localStorage.setItem('calicoChessState', JSON.stringify(initialState))

    renderWithProvider(<Menu />)
    
    expect(screen.getByText('French Defense')).toBeInTheDocument()
    expect(screen.getByText('✏️ Editing')).toBeInTheDocument()
  })

  it('does not crash when handlers are not provided', () => {
    renderWithProvider(<Menu />)
    
    fireEvent.click(screen.getByText('Select Repertoire'))
    fireEvent.click(screen.getByText('Manage Repertoires'))
    fireEvent.click(screen.getByText('Settings'))
    // Should not throw any errors
  })

  it('calls onSelectRepertoire when clicking repertoire button with active repertoire', () => {
    const mockOnSelectRepertoire = vi.fn()
    const initialState = {
      version: '1.0.0',
      preferences: {
        lightSquareColor: '#f0d9b5',
        darkSquareColor: '#b58863',
        boardSize: 480,
        theme: 'calico'
      },
      repertoires: [{
        id: 'rep1',
        name: 'Sicilian Defense',
        perspective: 'black' as const,
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
      }],
      selectedRepertoireId: 'rep1',
      repertoireMode: 'training' as const,
      lastModified: '2023-01-01T00:00:00.000Z'
    }

    localStorage.setItem('calicoChessState', JSON.stringify(initialState))

    renderWithProvider(<Menu onSelectRepertoire={mockOnSelectRepertoire} />)
    
    // Click on the repertoire name button to switch
    fireEvent.click(screen.getByText('Sicilian Defense'))
    expect(mockOnSelectRepertoire).toHaveBeenCalledTimes(1)
  })

  it('toggles swapBoardExplorer preference when swap button clicked', () => {
    // Swap control moved to SettingsModal; behavior covered in Settings tests
  })
})
