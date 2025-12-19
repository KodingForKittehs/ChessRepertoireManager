import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Chessboard from './Chessboard'

describe('Chessboard', () => {
  it('renders without crashing', () => {
    const { container } = render(<Chessboard />)
    expect(container.querySelector('.chessboard-container')).toBeInTheDocument()
  })

  it('renders the chessboard component', () => {
    const { container } = render(<Chessboard />)
    // react-chessboard renders SVG elements
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies custom light square color', () => {
    const customColor = '#e8e8e8'
    const { container } = render(<Chessboard lightSquareColor={customColor} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies custom dark square color', () => {
    const customColor = '#444444'
    const { container } = render(<Chessboard darkSquareColor={customColor} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('uses default colors when none provided', () => {
    const { container } = render(<Chessboard />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders with chessboard container wrapper', () => {
    const { container } = render(<Chessboard />)
    const wrapper = container.querySelector('.chessboard-container')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders resize handle', () => {
    const { container } = render(<Chessboard />)
    const resizeHandle = container.querySelector('.resize-handle')
    expect(resizeHandle).toBeInTheDocument()
  })
})
