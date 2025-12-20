import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProvider } from '../test/testUtils'
import SettingsModal from './SettingsModal'

describe('SettingsModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    localStorage.clear()
  })

  it('does not render when isOpen is false', () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={false} onClose={mockOnClose} />
    )
    
    expect(container.querySelector('.settings-modal')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('App Theme')).toBeInTheDocument()
    expect(screen.getByText('Square Colors')).toBeInTheDocument()
    expect(screen.getByText('Preset Themes')).toBeInTheDocument()
    expect(screen.getByText('State Management')).toBeInTheDocument()
  })

  it('closes when close button is clicked', () => {
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    fireEvent.click(screen.getByText('×'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('closes when overlay is clicked', () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const overlay = container.querySelector('.settings-overlay')!
    fireEvent.click(overlay)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when modal content is clicked', () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const modal = container.querySelector('.settings-modal')!
    fireEvent.click(modal)
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('displays current colors', () => {
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const lightInput = screen.getByLabelText('Light Squares') as HTMLInputElement
    const darkInput = screen.getByLabelText('Dark Squares') as HTMLInputElement
    
    expect(lightInput.value).toBe('#f0d9b5')
    expect(darkInput.value).toBe('#b58863')
  })

  it('updates light square color', async () => {
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const lightInput = screen.getByLabelText('Light Squares') as HTMLInputElement
    fireEvent.change(lightInput, { target: { value: '#ffffff' } })
    
    await waitFor(() => {
      expect(lightInput.value).toBe('#ffffff')
    })
  })

  it('updates dark square color', async () => {
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const darkInput = screen.getByLabelText('Dark Squares') as HTMLInputElement
    fireEvent.change(darkInput, { target: { value: '#000000' } })
    
    await waitFor(() => {
      expect(darkInput.value).toBe('#000000')
    })
  })

  it('applies preset board color theme', async () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    // Click the Blue board color preset theme (within preset-section)
    const presetSection = container.querySelector('.preset-section')
    const bluePreset = presetSection?.querySelector('[title="Blue"]') as HTMLElement
    fireEvent.click(bluePreset)
    
    await waitFor(() => {
      const lightInput = screen.getByLabelText('Light Squares') as HTMLInputElement
      const darkInput = screen.getByLabelText('Dark Squares') as HTMLInputElement
      
      expect(lightInput.value).toBe('#dee3e6')
      expect(darkInput.value).toBe('#8ca2ad')
    })
  })

  it('shows all board color preset themes', () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const presetSection = container.querySelector('.preset-section')
    expect(presetSection?.querySelector('[title="Classic"]')).toBeInTheDocument()
    expect(presetSection?.querySelector('[title="Blue"]')).toBeInTheDocument()
    expect(presetSection?.querySelector('[title="Green"]')).toBeInTheDocument()
    expect(presetSection?.querySelector('[title="Brown"]')).toBeInTheDocument()
    expect(presetSection?.querySelector('[title="Purple"]')).toBeInTheDocument()
    expect(presetSection?.querySelector('[title="Grey"]')).toBeInTheDocument()
  })

  it('displays state management buttons', () => {
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    expect(screen.getByText('Export Settings')).toBeInTheDocument()
    expect(screen.getByText('Import Settings')).toBeInTheDocument()
    expect(screen.getByText('Reset to Default')).toBeInTheDocument()
  })

  it('resets settings with confirmation', async () => {
    // Mock window.confirm before render
    const confirmSpy = vi.spyOn(window, 'confirm')
    confirmSpy.mockReturnValue(true)
    
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    // Change color first
    const lightInput = screen.getByLabelText('Light Squares') as HTMLInputElement
    fireEvent.change(lightInput, { target: { value: '#123456' } })
    
    await waitFor(() => {
      expect(lightInput.value).toBe('#123456')
    })
    
    // Reset
    fireEvent.click(screen.getByText('Reset to Default'))
    
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled()
      expect(screen.getByText('Settings reset successfully!')).toBeInTheDocument()
    })

    confirmSpy.mockRestore()
  })

  it('does not reset if user cancels confirmation', () => {
    const confirmSpy = vi.spyOn(window, 'confirm')
    confirmSpy.mockReturnValue(false)
    
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    fireEvent.click(screen.getByText('Reset to Default'))
    
    expect(confirmSpy).toHaveBeenCalled()
    expect(screen.queryByText('Settings reset successfully!')).not.toBeInTheDocument()

    confirmSpy.mockRestore()
  })

  it('shows all app theme options', () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const themeSection = container.querySelector('.theme-section')
    expect(themeSection?.querySelector('[title="Calico"]')).toBeInTheDocument()
    expect(themeSection?.querySelector('[title="Blue"]')).toBeInTheDocument()
    expect(themeSection?.querySelector('[title="Dark"]')).toBeInTheDocument()
    expect(themeSection?.querySelector('[title="Forest"]')).toBeInTheDocument()
  })

  it('displays current theme', () => {
    renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    expect(screen.getByText(/Current theme:/)).toBeInTheDocument()
    const themeInfo = screen.getByText(/Current theme:/)
    expect(themeInfo.textContent).toContain('Calico')
  })

  it('changes app theme when theme button is clicked', async () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )
    
    const themeSection = container.querySelector('.theme-section')
    const darkTheme = themeSection?.querySelector('[title="Dark"]') as HTMLElement
    
    fireEvent.click(darkTheme)
    
    await waitFor(() => {
      expect(darkTheme.classList.contains('active')).toBe(true)
    })
  })

  it('toggles swapBoardExplorer preference via checkbox', () => {
    const { container } = renderWithProvider(
      <SettingsModal isOpen={true} onClose={mockOnClose} />
    )

    const leftRadio = container.querySelector('input[name="boardPosition"][value="left"]') as HTMLInputElement
    const rightRadio = container.querySelector('input[name="boardPosition"][value="right"]') as HTMLInputElement
    expect(leftRadio).toBeInTheDocument()
    expect(rightRadio).toBeInTheDocument()

    // Default should be left (swap false)
    expect(leftRadio.checked).toBe(true)
    expect(rightRadio.checked).toBe(false)

    // Select right (board on right)
    fireEvent.click(rightRadio)

    const saved = JSON.parse(localStorage.getItem('calicoChessState')!)
    expect(saved.preferences.swapBoardExplorer).toBe(true)
  })
})
