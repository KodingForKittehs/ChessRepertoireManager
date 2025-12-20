import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProvider } from '../test/testUtils'
import Menu from './Menu'

describe('Menu', () => {
  it('renders menu buttons', () => {
    renderWithProvider(<Menu />)
    
    expect(screen.getByText('Repertoires')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('calls onRepertoires when Repertoires button is clicked', () => {
    const mockOnRepertoires = vi.fn()
    renderWithProvider(<Menu onRepertoires={mockOnRepertoires} />)
    
    fireEvent.click(screen.getByText('Repertoires'))
    expect(mockOnRepertoires).toHaveBeenCalledTimes(1)
  })

  it('calls onSettings when Settings button is clicked', () => {
    const mockOnSettings = vi.fn()
    renderWithProvider(<Menu onSettings={mockOnSettings} />)
    
    fireEvent.click(screen.getByText('Settings'))
    expect(mockOnSettings).toHaveBeenCalledTimes(1)
  })

  it('does not crash when handlers are not provided', () => {
    renderWithProvider(<Menu />)
    
    fireEvent.click(screen.getByText('Repertoires'))
    fireEvent.click(screen.getByText('Settings'))
    // Should not throw any errors
  })
})
