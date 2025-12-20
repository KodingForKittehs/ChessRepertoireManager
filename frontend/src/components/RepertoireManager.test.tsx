import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RepertoireManager from './RepertoireManager'
import { renderWithProvider } from '../test/testUtils'

describe('RepertoireManager', () => {
  it('should not render when isOpen is false', () => {
    const { container } = renderWithProvider(
      <RepertoireManager isOpen={false} onClose={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render when isOpen is true', () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('Repertoire Manager')).toBeInTheDocument()
  })

  it('should display create repertoire form', () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('Create New Repertoire')).toBeInTheDocument()
    expect(screen.getByLabelText('Name:')).toBeInTheDocument()
    expect(screen.getByLabelText('Perspective:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Repertoire' })).toBeInTheDocument()
  })

  it('should close when close button is clicked', () => {
    const onClose = vi.fn()
    renderWithProvider(<RepertoireManager isOpen={true} onClose={onClose} />)
    
    const closeButton = screen.getByRole('button', { name: '×' })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should create a new repertoire', async () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    
    // Fill in the form
    const nameInput = screen.getByLabelText('Name:')
    const perspectiveSelect = screen.getByLabelText('Perspective:')
    const createButton = screen.getByRole('button', { name: 'Create Repertoire' })
    
    fireEvent.change(nameInput, { target: { value: 'Sicilian Defense' } })
    fireEvent.change(perspectiveSelect, { target: { value: 'black' } })
    fireEvent.click(createButton)
    
    // Check if the repertoire is added to the list
    await waitFor(() => {
      expect(screen.getByText('Sicilian Defense')).toBeInTheDocument()
      expect(screen.getByText('(Black)')).toBeInTheDocument()
    })
    
    // Form should be cleared
    expect(nameInput).toHaveValue('')
    expect(perspectiveSelect).toHaveValue('white')
  })

  it('should not create a repertoire with empty name', () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    
    const createButton = screen.getByRole('button', { name: 'Create Repertoire' })
    fireEvent.click(createButton)
    
    // Should not add any repertoire
    expect(screen.queryByText('(White)')).not.toBeInTheDocument()
  })

  it('should display empty message when no repertoires exist', () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('No repertoires yet. Create one above!')).toBeInTheDocument()
  })

  it('should edit a repertoire', async () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    
    // Create a repertoire first
    const nameInput = screen.getByLabelText('Name:')
    const createButton = screen.getByRole('button', { name: 'Create Repertoire' })
    
    fireEvent.change(nameInput, { target: { value: 'French Defense' } })
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('French Defense')).toBeInTheDocument()
    })
    
    // Click edit button
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    // Edit the name and perspective
    const editInput = screen.getByDisplayValue('French Defense')
    const editSelect = screen.getAllByRole('combobox')[1] // The second select (in edit form)
    
    fireEvent.change(editInput, { target: { value: 'Caro-Kann Defense' } })
    fireEvent.change(editSelect, { target: { value: 'black' } })
    
    // Save the changes
    const saveButton = screen.getByRole('button', { name: 'Save' })
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText('Caro-Kann Defense')).toBeInTheDocument()
      expect(screen.getByText('(Black)')).toBeInTheDocument()
    })
  })

  it('should cancel editing', async () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    
    // Create a repertoire
    const nameInput = screen.getByLabelText('Name:')
    const createButton = screen.getByRole('button', { name: 'Create Repertoire' })
    
    fireEvent.change(nameInput, { target: { value: 'Spanish Opening' } })
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Spanish Opening')).toBeInTheDocument()
    })
    
    // Start editing
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    // Change the name
    const editInput = screen.getByDisplayValue('Spanish Opening')
    fireEvent.change(editInput, { target: { value: 'Italian Game' } })
    
    // Cancel the edit
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    // Name should not have changed
    await waitFor(() => {
      expect(screen.getByText('Spanish Opening')).toBeInTheDocument()
    })
    expect(screen.queryByText('Italian Game')).not.toBeInTheDocument()
  })

  it('should delete a repertoire with confirmation', async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    
    // Create a repertoire
    const nameInput = screen.getByLabelText('Name:')
    const createButton = screen.getByRole('button', { name: 'Create Repertoire' })
    
    fireEvent.change(nameInput, { target: { value: 'Pirc Defense' } })
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Pirc Defense')).toBeInTheDocument()
    })
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)
    
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this repertoire?')
    
    // Repertoire should be removed
    await waitFor(() => {
      expect(screen.queryByText('Pirc Defense')).not.toBeInTheDocument()
    })
    
    confirmSpy.mockRestore()
  })

  it('should not delete a repertoire when confirmation is cancelled', async () => {
    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    
    // Create a repertoire
    const nameInput = screen.getByLabelText('Name:')
    const createButton = screen.getByRole('button', { name: 'Create Repertoire' })
    
    fireEvent.change(nameInput, { target: { value: 'Alekhine Defense' } })
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Alekhine Defense')).toBeInTheDocument()
    })
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)
    
    // Repertoire should still exist
    expect(screen.getByText('Alekhine Defense')).toBeInTheDocument()
    
    confirmSpy.mockRestore()
  })

  it('should create repertoires with both white and black perspectives', async () => {
    renderWithProvider(<RepertoireManager isOpen={true} onClose={vi.fn()} />)
    
    const nameInput = screen.getByLabelText('Name:')
    const perspectiveSelect = screen.getByLabelText('Perspective:')
    const createButton = screen.getByRole('button', { name: 'Create Repertoire' })
    
    // Create white repertoire
    fireEvent.change(nameInput, { target: { value: "Queen's Gambit" } })
    fireEvent.change(perspectiveSelect, { target: { value: 'white' } })
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText("Queen's Gambit")).toBeInTheDocument()
    })
    
    // Create black repertoire
    fireEvent.change(nameInput, { target: { value: 'Nimzo-Indian Defense' } })
    fireEvent.change(perspectiveSelect, { target: { value: 'black' } })
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Nimzo-Indian Defense')).toBeInTheDocument()
    })
    
    // Check both are displayed with correct perspectives
    const whiteLabel = screen.getAllByText('(White)')
    const blackLabel = screen.getAllByText('(Black)')
    
    expect(whiteLabel.length).toBeGreaterThan(0)
    expect(blackLabel.length).toBeGreaterThan(0)
  })
})
