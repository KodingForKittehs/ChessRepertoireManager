import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

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
})
