import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProvider } from './test/testUtils'
import App from './App'

// Mock console.log to verify handler calls
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProvider(<App />)
    expect(screen.getByText('New Game')).toBeInTheDocument()
  })

  it('renders Menu component', () => {
    renderWithProvider(<App />)
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Load')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.getByText('Redo')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders Chessboard component', () => {
    const { container } = renderWithProvider(<App />)
    expect(container.querySelector('.chessboard-container')).toBeInTheDocument()
  })

  it('renders MoveExplorer component', () => {
    renderWithProvider(<App />)
    expect(screen.getByText('Move Explorer')).toBeInTheDocument()
  })

  it('calls handleNewGame when New Game button is clicked', () => {
    consoleLogSpy.mockClear()
    renderWithProvider(<App />)
    
    fireEvent.click(screen.getByText('New Game'))
    expect(consoleLogSpy).toHaveBeenCalledWith('New Game clicked')
  })

  it('calls handleSave when Save button is clicked', () => {
    consoleLogSpy.mockClear()
    renderWithProvider(<App />)
    
    fireEvent.click(screen.getByText('Save'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Save clicked')
  })

  it('calls handleLoad when Load button is clicked', () => {
    consoleLogSpy.mockClear()
    renderWithProvider(<App />)
    
    fireEvent.click(screen.getByText('Load'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Load clicked')
  })

  it('calls handleUndo when Undo button is clicked', () => {
    consoleLogSpy.mockClear()
    renderWithProvider(<App />)
    
    fireEvent.click(screen.getByText('Undo'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Undo clicked')
  })

  it('calls handleRedo when Redo button is clicked', () => {
    consoleLogSpy.mockClear()
    renderWithProvider(<App />)
    
    fireEvent.click(screen.getByText('Redo'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Redo clicked')
  })

  it('opens settings modal when Settings button is clicked', () => {
    const { container } = renderWithProvider(<App />)
    
    // Modal should not be visible initially
    expect(container.querySelector('.settings-modal')).not.toBeInTheDocument()
    
    // Click Settings button
    fireEvent.click(screen.getByText('Settings'))
    
    // Modal should now be visible
    expect(container.querySelector('.settings-modal')).toBeInTheDocument()
    expect(screen.getByText('Board Settings')).toBeInTheDocument()
  })
})
