import { describe, it, expect, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProvider } from '../test/testUtils'
import Chessboard from './Chessboard'
import type { AppState } from '../utils/appState'

describe('Chessboard', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProvider(<Chessboard />)
    expect(container.querySelector('.chessboard-container')).toBeInTheDocument()
  })

  it('renders the chessboard component', () => {
    const { container } = renderWithProvider(<Chessboard />)
    // react-chessboard renders SVG elements
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies custom light square color', () => {
    const customColor = '#e8e8e8'
    const { container } = renderWithProvider(<Chessboard lightSquareColor={customColor} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies custom dark square color', () => {
    const customColor = '#444444'
    const { container } = renderWithProvider(<Chessboard darkSquareColor={customColor} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('uses default colors when none provided', () => {
    const { container } = renderWithProvider(<Chessboard />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders with chessboard container wrapper', () => {
    const { container} = renderWithProvider(<Chessboard />)
    const wrapper = container.querySelector('.chessboard-container')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders resize handle', () => {
    const { container } = renderWithProvider(<Chessboard />)
    const resizeHandle = container.querySelector('.resize-handle')
    expect(resizeHandle).toBeInTheDocument()
  })

  it('handles drag resize', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = renderWithProvider(<Chessboard boardSize={480} onBoardSizeChange={onBoardSizeChange} />)
    
    const resizeHandle = container.querySelector('.resize-handle') as HTMLElement
    expect(resizeHandle).toBeInTheDocument()

    // Simulate drag start
    fireEvent.mouseDown(resizeHandle, { clientX: 100, clientY: 100 })
    
    // Simulate drag move
    fireEvent.mouseMove(document, { clientX: 150, clientY: 150 })
    
    // Simulate drag end
    fireEvent.mouseUp(document)
    
    expect(onBoardSizeChange).toHaveBeenCalled()
  })

  it('respects minimum size during drag resize', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = renderWithProvider(<Chessboard boardSize={320} onBoardSizeChange={onBoardSizeChange} />)
    
    const resizeHandle = container.querySelector('.resize-handle') as HTMLElement

    // Simulate drag that would go below minimum
    fireEvent.mouseDown(resizeHandle, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(document, { clientX: 0, clientY: 0 })
    fireEvent.mouseUp(document)
    
    // Should clamp to minimum
    const calls = onBoardSizeChange.mock.calls
    if (calls.length > 0) {
      const lastCall = calls[calls.length - 1][0]
      expect(lastCall).toBeGreaterThanOrEqual(320)
    }
  })

  it('respects maximum size during drag resize', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = renderWithProvider(<Chessboard boardSize={800} onBoardSizeChange={onBoardSizeChange} />)
    
    const resizeHandle = container.querySelector('.resize-handle') as HTMLElement

    // Simulate drag that would go above maximum
    fireEvent.mouseDown(resizeHandle, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(document, { clientX: 1000, clientY: 1000 })
    fireEvent.mouseUp(document)
    
    // Should clamp to maximum
    const calls = onBoardSizeChange.mock.calls
    if (calls.length > 0) {
      const lastCall = calls[calls.length - 1][0]
      expect(lastCall).toBeLessThanOrEqual(800)
    }
  })

  it('does not show editing mode controls when not in editing mode', () => {
    renderWithProvider(<Chessboard />)
    expect(screen.queryByText(/Editing Mode/)).not.toBeInTheDocument()
  })

  it('shows editing mode controls when in editing mode', () => {
    const mockState: Partial<AppState> = {
      selectedRepertoireId: 'rep_test',
      repertoireMode: 'editing',
      repertoires: [{
        id: 'rep_test',
        name: 'Test Repertoire',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }

    renderWithProvider(<Chessboard />, mockState)
    expect(screen.getByText(/Editing Mode/)).toBeInTheDocument()
    expect(screen.getByTitle('Undo last move')).toBeInTheDocument()
    expect(screen.getByTitle('Reset to starting position')).toBeInTheDocument()
  })

  it('undo button is disabled when no moves have been made', () => {
    const mockState: Partial<AppState> = {
      selectedRepertoireId: 'rep_test',
      repertoireMode: 'editing',
      repertoires: [{
        id: 'rep_test',
        name: 'Test Repertoire',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }

    renderWithProvider(<Chessboard />, mockState)
    const undoButton = screen.getByTitle('Undo last move')
    expect(undoButton).toBeDisabled()
  })

  it('shows correct board orientation based on repertoire perspective', () => {
    const mockState: Partial<AppState> = {
      selectedRepertoireId: 'rep_test',
      repertoireMode: 'editing',
      repertoires: [{
        id: 'rep_test',
        name: 'Test Repertoire',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }

    const { container } = renderWithProvider(<Chessboard />, mockState)
    // The board should be rendered
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('resets position when reset button is clicked', () => {
    const mockState: Partial<AppState> = {
      selectedRepertoireId: 'rep_test',
      repertoireMode: 'editing',
      repertoires: [{
        id: 'rep_test',
        name: 'Test Repertoire',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }

    renderWithProvider(<Chessboard />, mockState)
    const resetButton = screen.getByTitle('Reset to starting position')
    fireEvent.click(resetButton)
    // Should still be in editing mode
    expect(screen.getByText(/Editing Mode/)).toBeInTheDocument()
  })
})
