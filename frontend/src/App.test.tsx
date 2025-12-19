import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

// Mock console.log to verify handler calls
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('New Game')).toBeInTheDocument()
  })

  it('renders Menu component', () => {
    render(<App />)
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Load')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.getByText('Redo')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders Chessboard component', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.chessboard')).toBeInTheDocument()
  })

  it('calls handleNewGame when New Game button is clicked', () => {
    consoleLogSpy.mockClear()
    render(<App />)
    
    fireEvent.click(screen.getByText('New Game'))
    expect(consoleLogSpy).toHaveBeenCalledWith('New Game clicked')
  })

  it('calls handleSave when Save button is clicked', () => {
    consoleLogSpy.mockClear()
    render(<App />)
    
    fireEvent.click(screen.getByText('Save'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Save clicked')
  })

  it('calls handleLoad when Load button is clicked', () => {
    consoleLogSpy.mockClear()
    render(<App />)
    
    fireEvent.click(screen.getByText('Load'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Load clicked')
  })

  it('calls handleUndo when Undo button is clicked', () => {
    consoleLogSpy.mockClear()
    render(<App />)
    
    fireEvent.click(screen.getByText('Undo'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Undo clicked')
  })

  it('calls handleRedo when Redo button is clicked', () => {
    consoleLogSpy.mockClear()
    render(<App />)
    
    fireEvent.click(screen.getByText('Redo'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Redo clicked')
  })

  it('calls handleSettings when Settings button is clicked', () => {
    consoleLogSpy.mockClear()
    render(<App />)
    
    fireEvent.click(screen.getByText('Settings'))
    expect(consoleLogSpy).toHaveBeenCalledWith('Settings clicked')
  })
})
