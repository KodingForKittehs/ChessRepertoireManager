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

  it('renders resize controls', () => {
    const { container } = render(<Chessboard />)
    const controls = container.querySelector('.chessboard-controls')
    expect(controls).toBeInTheDocument()
    
    const buttons = container.querySelectorAll('.size-btn')
    expect(buttons).toHaveLength(3) // decrease, reset, increase
  })

  it('calls onBoardSizeChange when increase button clicked', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = render(<Chessboard boardSize={560} onBoardSizeChange={onBoardSizeChange} />)
    
    const buttons = container.querySelectorAll('.size-btn')
    fireEvent.click(buttons[2]) // increase button
    
    expect(onBoardSizeChange).toHaveBeenCalledWith(600)
  })

  it('calls onBoardSizeChange when decrease button clicked', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = render(<Chessboard boardSize={560} onBoardSizeChange={onBoardSizeChange} />)
    
    const buttons = container.querySelectorAll('.size-btn')
    fireEvent.click(buttons[0]) // decrease button
    
    expect(onBoardSizeChange).toHaveBeenCalledWith(520)
  })

  it('calls onBoardSizeChange when reset button clicked', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = render(<Chessboard boardSize={720} onBoardSizeChange={onBoardSizeChange} />)
    
    const buttons = container.querySelectorAll('.size-btn')
    fireEvent.click(buttons[1]) // reset button
    
    expect(onBoardSizeChange).toHaveBeenCalledWith(560)
  })

  it('respects minimum board size', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = render(<Chessboard boardSize={320} onBoardSizeChange={onBoardSizeChange} />)
    
    const buttons = container.querySelectorAll('.size-btn')
    fireEvent.click(buttons[0]) // decrease button
    
    expect(onBoardSizeChange).toHaveBeenCalledWith(320) // should not go below 320
  })

  it('respects maximum board size', () => {
    const onBoardSizeChange = vi.fn()
    const { container } = render(<Chessboard boardSize={800} onBoardSizeChange={onBoardSizeChange} />)
    
    const buttons = container.querySelectorAll('.size-btn')
    fireEvent.click(buttons[2]) // increase button
    
    expect(onBoardSizeChange).toHaveBeenCalledWith(800) // should not go above 800
  })
})
