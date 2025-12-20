import { useState } from 'react'
import Chessboard from './components/Chessboard'
import Menu from './components/Menu'
import MoveExplorer from './components/MoveExplorer'
import SettingsModal from './components/SettingsModal'
import RepertoireManager from './components/RepertoireManager'
import { useAppState } from './contexts/AppStateContext'
import './App.css'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isRepertoireManagerOpen, setIsRepertoireManagerOpen] = useState(false)
  const { state, currentTheme, updateBoardSize } = useAppState()

  const handleNewGame = () => {
    console.log('New Game clicked')
    // TODO: Implement new game logic
  }

  const handleSave = () => {
    console.log('Save clicked')
    // TODO: Implement save game logic
  }

  const handleLoad = () => {
    console.log('Load clicked')
    // TODO: Implement load game logic
  }

  const handleUndo = () => {
    console.log('Undo clicked')
    // TODO: Implement undo logic
  }

  const handleRedo = () => {
    console.log('Redo clicked')
    // TODO: Implement redo logic
  }

  const handleSettings = () => {
    setIsSettingsOpen(true)
  }

  const handleCloseSettings = () => {
    setIsSettingsOpen(false)
  }

  const handleRepertoires = () => {
    setIsRepertoireManagerOpen(true)
  }

  const handleCloseRepertoireManager = () => {
    setIsRepertoireManagerOpen(false)
  }

  return (
    <div 
      className="app" 
      style={{ 
        background: currentTheme.background,
        color: currentTheme.foreground 
      }}
    >
      <div className="app-container">
        <Menu
          onNewGame={handleNewGame}
          onSave={handleSave}
          onLoad={handleLoad}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSettings={handleSettings}
          onRepertoires={handleRepertoires}
        />
        <div className="main-content">
          <Chessboard 
            lightSquareColor={state.preferences.lightSquareColor}
            darkSquareColor={state.preferences.darkSquareColor}
            boardSize={state.preferences.boardSize}
            onBoardSizeChange={updateBoardSize}
          />
          <MoveExplorer />
        </div>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
        />
        <RepertoireManager
          isOpen={isRepertoireManagerOpen}
          onClose={handleCloseRepertoireManager}
        />
      </div>
    </div>
  )
}

export default App
