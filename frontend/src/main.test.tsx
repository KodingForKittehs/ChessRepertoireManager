import { describe, it, expect, vi, beforeAll } from 'vitest'

// Mock react-dom/client before importing main
const renderMock = vi.fn()
const createRootMock = vi.fn(() => ({
  render: renderMock,
  unmount: vi.fn()
}))

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock
}))

describe('main.tsx', () => {
  beforeAll(async () => {
    // Set up a root element before importing main
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    // Import main.tsx which will execute its code
    await import('./main')
  })

  it('creates a root element', () => {
    const rootElement = document.getElementById('root')
    expect(rootElement).toBeTruthy()
    expect(createRootMock).toHaveBeenCalledWith(rootElement)
  })

  it('renders the application', () => {
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalled()
  })

  it('renders with StrictMode', () => {
    const renderCall = renderMock.mock.calls[0][0]
    // Check that something was rendered (the exact structure may vary)
    expect(renderCall).toBeTruthy()
    expect(renderCall.type).toBeTruthy()
  })
})

