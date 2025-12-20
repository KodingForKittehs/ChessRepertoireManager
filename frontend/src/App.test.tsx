import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProvider } from './test/testUtils'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProvider(<App />)
    expect(screen.getByText('Select Repertoire')).toBeInTheDocument()
  })

  it('renders Menu component', () => {
    renderWithProvider(<App />)
    expect(screen.getByText('Manage Repertoires')).toBeInTheDocument()
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

  it('opens settings modal when Settings button is clicked', () => {
    const { container } = renderWithProvider(<App />)
    
    // Modal should not be visible initially
    expect(container.querySelector('.settings-modal')).not.toBeInTheDocument()
    
    // Click Settings button
    fireEvent.click(screen.getByText('Settings'))
    
    // Modal should now be visible
    expect(container.querySelector('.settings-modal')).toBeInTheDocument()
    expect(container.querySelector('.settings-header')).toBeInTheDocument()
  })

  it('opens repertoire manager when Manage Repertoires button is clicked', () => {
    const { container } = renderWithProvider(<App />)
    
    // Modal should not be visible initially
    expect(container.querySelector('.repertoire-manager')).not.toBeInTheDocument()
    
    // Click Manage Repertoires button
    fireEvent.click(screen.getByText('Manage Repertoires'))
    
    // Modal should now be visible
    expect(container.querySelector('.repertoire-manager')).toBeInTheDocument()
    expect(screen.getByText('Repertoire Manager')).toBeInTheDocument()
  })
})
