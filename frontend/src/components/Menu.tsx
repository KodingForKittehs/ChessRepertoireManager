import { useAppState } from '../contexts/AppStateContext'
import './Menu.css'

interface MenuProps {
  onSettings?: () => void
  onRepertoires?: () => void
}

function Menu({ onSettings, onRepertoires }: MenuProps) {
  const { currentTheme } = useAppState()
  
  return (
    <div 
      className="menu" 
      style={{ 
        backgroundColor: currentTheme.cardBackground,
        color: currentTheme.foreground 
      }}
    >
      <div className="menu-section">
        <button className="menu-button" onClick={onRepertoires}>
          Repertoires
        </button>
        <button className="menu-button" onClick={onSettings}>
          Settings
        </button>
      </div>
    </div>
  )
}

export default Menu
