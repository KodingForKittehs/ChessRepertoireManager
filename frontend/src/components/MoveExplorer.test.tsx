import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MoveExplorer from './MoveExplorer'

describe('MoveExplorer', () => {
  it('renders without crashing', () => {
    render(<MoveExplorer />)
    expect(screen.getByText('Move Explorer')).toBeInTheDocument()
  })

  it('renders placeholder text', () => {
    render(<MoveExplorer />)
    expect(screen.getByText('Move history and analysis will appear here')).toBeInTheDocument()
  })

  it('has the correct structure', () => {
    const { container } = render(<MoveExplorer />)
    expect(container.querySelector('.move-explorer')).toBeInTheDocument()
    expect(container.querySelector('.move-explorer-header')).toBeInTheDocument()
    expect(container.querySelector('.move-explorer-content')).toBeInTheDocument()
  })

  it('renders resize handle', () => {
    const { container } = render(<MoveExplorer />)
    const resizeHandle = container.querySelector('.resize-handle')
    expect(resizeHandle).toBeInTheDocument()
  })
})
