import { useAppState } from '../contexts/AppStateContext'
import type { RepertoireMode } from '../utils/appState'
import './RepertoireSelector.css'

interface RepertoireSelectorProps {
  isOpen: boolean
  onClose: () => void
}

function RepertoireSelector({ isOpen, onClose }: RepertoireSelectorProps) {
  const { state, currentTheme, selectRepertoire } = useAppState()

  if (!isOpen) return null

  const handleSelectMode = (repertoireId: string, mode: RepertoireMode) => {
    selectRepertoire(repertoireId, mode)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="repertoire-selector-overlay">
      <div 
        className="repertoire-selector"
        style={{
          backgroundColor: currentTheme.cardBackground,
          color: currentTheme.foreground
        }}
      >
        <div 
          className="repertoire-selector-header"
          style={{
            backgroundColor: currentTheme.headerBackground,
            color: '#ffffff'
          }}
        >
          <h2>Select Repertoire</h2>
          <button 
            className="close-button" 
            onClick={handleCancel}
            style={{ color: '#ffffff' }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="repertoire-selector-content">
          {state.repertoires.length === 0 ? (
            <div className="empty-state">
              <p>No repertoires available.</p>
              <p>Create a repertoire first using the Repertoire Manager.</p>
            </div>
          ) : (
            <>
              <p className="instruction-text">
                Choose a repertoire and select how you want to work with it:
              </p>
              <div className="repertoire-cards">
                {state.repertoires.map((repertoire) => (
                  <div 
                    key={repertoire.id} 
                    className="repertoire-card"
                    style={{
                      borderColor: currentTheme.accent
                    }}
                  >
                    <div className="repertoire-card-header">
                      <h3>{repertoire.name}</h3>
                      <span className="repertoire-badge">
                        {repertoire.perspective === 'white' ? '♔' : '♚'} {repertoire.perspective}
                      </span>
                    </div>
                    <div className="repertoire-card-stats">
                      <p className="repertoire-stat">
                        Positions: {repertoire.nodes ? Object.keys(repertoire.nodes).length : 0}
                      </p>
                      <p className="repertoire-stat">
                        Last updated: {new Date(repertoire.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="repertoire-card-actions">
                      <button
                        className="mode-button training-button"
                        onClick={() => handleSelectMode(repertoire.id, 'training')}
                        style={{
                          backgroundColor: currentTheme.accent,
                          color: '#ffffff'
                        }}
                        title="Practice this repertoire with training exercises"
                      >
                        🎯 Train
                      </button>
                      <button
                        className="mode-button editing-button"
                        onClick={() => handleSelectMode(repertoire.id, 'editing')}
                        style={{
                          backgroundColor: currentTheme.accent,
                          color: '#ffffff'
                        }}
                        title="Edit and build your repertoire tree"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="repertoire-selector-footer">
          <button 
            className="cancel-button" 
            onClick={handleCancel}
            style={{
              backgroundColor: currentTheme.accent,
              color: '#ffffff'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default RepertoireSelector
