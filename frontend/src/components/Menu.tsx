import { useAppState } from '../contexts/AppStateContext'
import './Menu.css'

interface MenuProps {
  onSettings?: () => void
  onRepertoires?: () => void
  onSelectRepertoire?: () => void
}

function Menu({ onSettings, onRepertoires, onSelectRepertoire }: MenuProps) {
  const { state, currentTheme } = useAppState()
  
  // Get the currently selected repertoire if any
  const selectedRepertoire = state.selectedRepertoireId 
    ? state.repertoires.find(r => r.id === state.selectedRepertoireId)
    : null

  const getModeLabel = () => {
    if (!selectedRepertoire || !state.repertoireMode) return ''
    return state.repertoireMode === 'training' ? '🎯 Training' : '✏️ Editing'
  }

  return (
    <div 
      className="menu" 
      style={{ 
        backgroundColor: currentTheme.cardBackground,
        color: currentTheme.foreground 
      }}
    >
      <div className="menu-section">
        {selectedRepertoire && (
          <div 
            className="active-repertoire-display"
            style={{
              backgroundColor: currentTheme.accent,
              color: '#ffffff'
            }}
          >
            <div className="active-repertoire-name">{selectedRepertoire.name}</div>
            <div className="active-repertoire-mode">{getModeLabel()}</div>
          </div>
        )}
        
        <button 
          className="menu-button" 
          onClick={onSelectRepertoire}
          style={{
            backgroundColor: currentTheme.accent,
            borderColor: currentTheme.accent,
            color: '#ffffff'
          }}
        >
          {selectedRepertoire ? 'Switch Repertoire' : 'Select Repertoire'}
        </button>
        
        <button 
          className="menu-button" 
          onClick={onRepertoires}
          style={{
            backgroundColor: currentTheme.accent,
            borderColor: currentTheme.accent,
            color: '#ffffff'
          }}
        >
          Manage Repertoires
        </button>
        <button 
          className="menu-button" 
          onClick={onSettings}
          style={{
            backgroundColor: currentTheme.accent,
            borderColor: currentTheme.accent,
            color: '#ffffff'
          }}
        >
          Settings
        </button>
      </div>
    </div>
  )
}

export default Menu
