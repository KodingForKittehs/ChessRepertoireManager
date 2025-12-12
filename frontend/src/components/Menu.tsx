import './Menu.css'

interface MenuProps {
  onNewGame?: () => void
  onSave?: () => void
  onLoad?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSettings?: () => void
}

function Menu({ onNewGame, onSave, onLoad, onUndo, onRedo, onSettings }: MenuProps) {
  return (
    <div className="menu">
      <div className="menu-section">
        <button className="menu-button" onClick={onNewGame}>
          New Game
        </button>
        <button className="menu-button" onClick={onSave}>
          Save
        </button>
        <button className="menu-button" onClick={onLoad}>
          Load
        </button>
      </div>
      <div className="menu-section">
        <button className="menu-button" onClick={onUndo}>
          Undo
        </button>
        <button className="menu-button" onClick={onRedo}>
          Redo
        </button>
      </div>
      <div className="menu-section">
        <button className="menu-button" onClick={onSettings}>
          Settings
        </button>
      </div>
    </div>
  )
}

export default Menu
