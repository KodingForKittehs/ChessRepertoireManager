import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import RepertoireSelector from './RepertoireSelector'
import { renderWithProvider } from '../test/testUtils'

describe('RepertoireSelector', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should not render when isOpen is false', () => {
    const { container } = renderWithProvider(
      <RepertoireSelector isOpen={false} onClose={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render when isOpen is true', () => {
    renderWithProvider(<RepertoireSelector isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Select Repertoire')).toBeInTheDocument()
  })

  it('should show empty state when no repertoires exist', () => {
    renderWithProvider(<RepertoireSelector isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('No repertoires available.')).toBeInTheDocument()
    expect(screen.getByText(/Create a repertoire first/i)).toBeInTheDocument()
  })

  it('should display repertoires with train and edit buttons', () => {
    // Create initial state with a repertoire
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
        name: 'King\'s Indian Defense',
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
      selectedRepertoireId: null,
      repertoireMode: null,
      lastModified: '2023-01-01T00:00:00.000Z'
    }

    localStorage.setItem('calicoChessState', JSON.stringify(initialState))

    renderWithProvider(<RepertoireSelector isOpen={true} onClose={() => {}} />)
    
    expect(screen.getByText('King\'s Indian Defense')).toBeInTheDocument()
    expect(screen.getByText(/♚ black/i)).toBeInTheDocument()
    expect(screen.getByText(/Positions: 1/i)).toBeInTheDocument()
    expect(screen.getByText('🎯 Train')).toBeInTheDocument()
    expect(screen.getByText('✏️ Edit')).toBeInTheDocument()
  })

  it('should call onClose when cancel button is clicked', () => {
    const handleClose = vi.fn()
    renderWithProvider(<RepertoireSelector isOpen={true} onClose={handleClose} />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when close button (×) is clicked', () => {
    const handleClose = vi.fn()
    renderWithProvider(<RepertoireSelector isOpen={true} onClose={handleClose} />)
    
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should select repertoire in training mode and close', () => {
    const handleClose = vi.fn()
    
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
      selectedRepertoireId: null,
      repertoireMode: null,
      lastModified: '2023-01-01T00:00:00.000Z'
    }

    localStorage.setItem('calicoChessState', JSON.stringify(initialState))

    renderWithProvider(<RepertoireSelector isOpen={true} onClose={handleClose} />)
    
    const trainButton = screen.getByText('🎯 Train')
    fireEvent.click(trainButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
    
    // Verify state was updated
    const savedState = JSON.parse(localStorage.getItem('calicoChessState') || '{}')
    expect(savedState.selectedRepertoireId).toBe('rep1')
    expect(savedState.repertoireMode).toBe('training')
  })

  it('should select repertoire in editing mode and close', () => {
    const handleClose = vi.fn()
    
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
        name: 'Italian Game',
        perspective: 'white' as const,
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
      selectedRepertoireId: null,
      repertoireMode: null,
      lastModified: '2023-01-01T00:00:00.000Z'
    }

    localStorage.setItem('calicoChessState', JSON.stringify(initialState))

    renderWithProvider(<RepertoireSelector isOpen={true} onClose={handleClose} />)
    
    const editButton = screen.getByText('✏️ Edit')
    fireEvent.click(editButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
    
    // Verify state was updated
    const savedState = JSON.parse(localStorage.getItem('calicoChessState') || '{}')
    expect(savedState.selectedRepertoireId).toBe('rep1')
    expect(savedState.repertoireMode).toBe('editing')
  })
})
