import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Chessboard from './Chessboard'

describe('Chessboard', () => {
  it('renders without crashing', () => {
    const { container } = render(<Chessboard />)
    expect(container.querySelector('.chessboard')).toBeInTheDocument()
  })

  it('renders 64 squares', () => {
    const { container } = render(<Chessboard />)
    const squares = container.querySelectorAll('.square')
    expect(squares).toHaveLength(64)
  })

  it('renders alternating light and dark squares', () => {
    const { container } = render(<Chessboard />)
    const lightSquares = container.querySelectorAll('.square.light')
    const darkSquares = container.querySelectorAll('.square.dark')
    
    expect(lightSquares).toHaveLength(32)
    expect(darkSquares).toHaveLength(32)
  })

  it('renders pieces in initial position', () => {
    const { container } = render(<Chessboard />)
    const pieces = container.querySelectorAll('.piece')
    
    // Should have 32 pieces (16 per side) in initial position
    expect(pieces).toHaveLength(32)
  })

  it('renders white king on initial position', () => {
    const { container } = render(<Chessboard />)
    const pieces = container.querySelectorAll('.piece')
    const piecesArray = Array.from(pieces).map(p => p.textContent)
    
    // White king (♔) should be present
    expect(piecesArray).toContain('♔')
  })

  it('renders black king on initial position', () => {
    const { container } = render(<Chessboard />)
    const pieces = container.querySelectorAll('.piece')
    const piecesArray = Array.from(pieces).map(p => p.textContent)
    
    // Black king (♚) should be present
    expect(piecesArray).toContain('♚')
  })
})
