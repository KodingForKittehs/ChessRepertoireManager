import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Menu from './Menu'

describe('Menu', () => {
  it('renders all buttons', () => {
    render(<Menu />)
    
    expect(screen.getByText('New Game')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Load')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.getByText('Redo')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('calls onNewGame when New Game button is clicked', () => {
    const mockOnNewGame = vi.fn()
    render(<Menu onNewGame={mockOnNewGame} />)
    
    fireEvent.click(screen.getByText('New Game'))
    expect(mockOnNewGame).toHaveBeenCalledTimes(1)
  })

  it('calls onSave when Save button is clicked', () => {
    const mockOnSave = vi.fn()
    render(<Menu onSave={mockOnSave} />)
    
    fireEvent.click(screen.getByText('Save'))
    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })

  it('calls onLoad when Load button is clicked', () => {
    const mockOnLoad = vi.fn()
    render(<Menu onLoad={mockOnLoad} />)
    
    fireEvent.click(screen.getByText('Load'))
    expect(mockOnLoad).toHaveBeenCalledTimes(1)
  })

  it('calls onUndo when Undo button is clicked', () => {
    const mockOnUndo = vi.fn()
    render(<Menu onUndo={mockOnUndo} />)
    
    fireEvent.click(screen.getByText('Undo'))
    expect(mockOnUndo).toHaveBeenCalledTimes(1)
  })

  it('calls onRedo when Redo button is clicked', () => {
    const mockOnRedo = vi.fn()
    render(<Menu onRedo={mockOnRedo} />)
    
    fireEvent.click(screen.getByText('Redo'))
    expect(mockOnRedo).toHaveBeenCalledTimes(1)
  })

  it('calls onSettings when Settings button is clicked', () => {
    const mockOnSettings = vi.fn()
    render(<Menu onSettings={mockOnSettings} />)
    
    fireEvent.click(screen.getByText('Settings'))
    expect(mockOnSettings).toHaveBeenCalledTimes(1)
  })

  it('does not crash when handlers are not provided', () => {
    render(<Menu />)
    
    fireEvent.click(screen.getByText('New Game'))
    fireEvent.click(screen.getByText('Save'))
    fireEvent.click(screen.getByText('Load'))
    // Should not throw any errors
  })
})
