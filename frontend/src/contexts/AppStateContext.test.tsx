import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProvider } from '../test/testUtils'
import { useAppState } from '../contexts/AppStateContext'

// Test component that uses the hook
function TestComponent() {
  const { 
    state, 
    updateLightSquareColor, 
    updateDarkSquareColor,
    updateBoardSize,
    resetAppState 
  } = useAppState()

  return (
    <div>
      <div data-testid="light-color">{state.preferences.lightSquareColor}</div>
      <div data-testid="dark-color">{state.preferences.darkSquareColor}</div>
      <div data-testid="board-size">{state.preferences.boardSize}</div>
      <div data-testid="version">{state.version}</div>
      <button onClick={() => updateLightSquareColor('#ffffff')}>
        Change Light
      </button>
      <button onClick={() => updateDarkSquareColor('#000000')}>
        Change Dark
      </button>
      <button onClick={() => updateBoardSize(640)}>
        Change Size
      </button>
      <button onClick={resetAppState}>Reset</button>
    </div>
  )
}

describe('AppStateContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides default state when no saved state exists', () => {
    renderWithProvider(<TestComponent />)
    
    expect(screen.getByTestId('light-color')).toHaveTextContent('#f0d9b5')
    expect(screen.getByTestId('dark-color')).toHaveTextContent('#b58863')
    expect(screen.getByTestId('board-size')).toHaveTextContent('480')
    expect(screen.getByTestId('version')).toHaveTextContent('1.0.0')
  })

  it('updates light square color', async () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByText('Change Light'))
    
    await waitFor(() => {
      expect(screen.getByTestId('light-color')).toHaveTextContent('#ffffff')
    })
  })

  it('updates dark square color', async () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByText('Change Dark'))
    
    await waitFor(() => {
      expect(screen.getByTestId('dark-color')).toHaveTextContent('#000000')
    })
  })

  it('persists state to localStorage', async () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByText('Change Light'))
    
    await waitFor(() => {
      const saved = localStorage.getItem('calicoChessState')
      expect(saved).toBeTruthy()
      const state = JSON.parse(saved!)
      expect(state.preferences.lightSquareColor).toBe('#ffffff')
    })
  })

  it('resets state to defaults', async () => {
    renderWithProvider(<TestComponent />)
    
    // Change colors
    fireEvent.click(screen.getByText('Change Light'))
    fireEvent.click(screen.getByText('Change Dark'))
    
    await waitFor(() => {
      expect(screen.getByTestId('light-color')).toHaveTextContent('#ffffff')
    })
    
    // Reset
    fireEvent.click(screen.getByText('Reset'))
    
    await waitFor(() => {
      expect(screen.getByTestId('light-color')).toHaveTextContent('#f0d9b5')
      expect(screen.getByTestId('dark-color')).toHaveTextContent('#b58863')
    })
  })

  it('loads state from localStorage on mount', () => {
    // Pre-populate localStorage
    const savedState = {
      version: '1.0.0',
      preferences: {
        lightSquareColor: '#aabbcc',
        darkSquareColor: '#ddeeff',
        boardSize: 480
      },
      repertoires: [],
      lastModified: new Date().toISOString()
    }
    localStorage.setItem('calicoChessState', JSON.stringify(savedState))
    
    renderWithProvider(<TestComponent />)
    
    expect(screen.getByTestId('light-color')).toHaveTextContent('#aabbcc')
    expect(screen.getByTestId('dark-color')).toHaveTextContent('#ddeeff')
    expect(screen.getByTestId('board-size')).toHaveTextContent('480')
  })

  it('updates board size', async () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByText('Change Size'))
    
    await waitFor(() => {
      expect(screen.getByTestId('board-size')).toHaveTextContent('640')
    })
  })
})
