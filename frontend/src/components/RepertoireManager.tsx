import { useState } from 'react'
import { useAppState } from '../contexts/AppStateContext'
import type { Perspective } from '../utils/appState'
import './RepertoireManager.css'

interface RepertoireManagerProps {
  isOpen: boolean
  onClose: () => void
}

function RepertoireManager({ isOpen, onClose }: RepertoireManagerProps) {
  const { state, currentTheme, addRepertoire, updateRepertoire, deleteRepertoire } = useAppState()
  const [newRepertoireName, setNewRepertoireName] = useState('')
  const [newRepertoirePerspective, setNewRepertoirePerspective] = useState<Perspective>('white')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPerspective, setEditPerspective] = useState<Perspective>('white')

  if (!isOpen) return null

  const handleCreateRepertoire = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRepertoireName.trim()) {
      addRepertoire({
        name: newRepertoireName.trim(),
        perspective: newRepertoirePerspective,
        openings: []
      })
      setNewRepertoireName('')
      setNewRepertoirePerspective('white')
    }
  }

  const handleStartEdit = (id: string, name: string, perspective: Perspective) => {
    setEditingId(id)
    setEditName(name)
    setEditPerspective(perspective)
  }

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      updateRepertoire(id, {
        name: editName.trim(),
        perspective: editPerspective
      })
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditPerspective('white')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this repertoire?')) {
      deleteRepertoire(id)
    }
  }

  return (
    <div className="repertoire-manager-overlay">
      <div 
        className="repertoire-manager"
        style={{
          backgroundColor: currentTheme.cardBackground,
          color: currentTheme.foreground
        }}
      >
        <div 
          className="repertoire-manager-header"
          style={{
            backgroundColor: currentTheme.headerBackground,
            color: '#ffffff'
          }}
        >
          <h2>Repertoire Manager</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            style={{ color: '#ffffff' }}
          >
            ×
          </button>
        </div>

        <div className="repertoire-manager-content">
          {/* Create New Repertoire Form */}
          <form onSubmit={handleCreateRepertoire} className="create-repertoire-form">
            <h3>Create New Repertoire</h3>
            <div className="form-group">
              <label htmlFor="repertoire-name">Name:</label>
              <input
                id="repertoire-name"
                type="text"
                value={newRepertoireName}
                onChange={(e) => setNewRepertoireName(e.target.value)}
                placeholder="e.g., King's Indian Defense"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="repertoire-perspective">Perspective:</label>
              <select
                id="repertoire-perspective"
                value={newRepertoirePerspective}
                onChange={(e) => setNewRepertoirePerspective(e.target.value as Perspective)}
              >
                <option value="white">White</option>
                <option value="black">Black</option>
              </select>
            </div>
            <button type="submit" className="create-button">Create Repertoire</button>
          </form>

          {/* Repertoire List */}
          <div className="repertoire-list">
            <h3>Your Repertoires</h3>
            {state.repertoires.length === 0 ? (
              <p className="empty-message">No repertoires yet. Create one above!</p>
            ) : (
              <ul>
                {state.repertoires.map((repertoire) => (
                  <li key={repertoire.id} className="repertoire-item">
                    {editingId === repertoire.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="edit-input"
                        />
                        <select
                          value={editPerspective}
                          onChange={(e) => setEditPerspective(e.target.value as Perspective)}
                          className="edit-select"
                        >
                          <option value="white">White</option>
                          <option value="black">Black</option>
                        </select>
                        <div className="edit-actions">
                          <button onClick={() => handleSaveEdit(repertoire.id)} className="save-button">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-button">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="repertoire-info">
                        <div className="repertoire-details">
                          <span className="repertoire-name">{repertoire.name}</span>
                          <span className="repertoire-perspective">
                            ({repertoire.perspective === 'white' ? 'White' : 'Black'})
                          </span>
                        </div>
                        <div className="repertoire-actions">
                          <button
                            onClick={() => handleStartEdit(repertoire.id, repertoire.name, repertoire.perspective)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(repertoire.id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RepertoireManager
