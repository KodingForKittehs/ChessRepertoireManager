import { useState } from 'react'
import Chessboard from './components/Chessboard'
import Menu from './components/Menu'
import MoveExplorer from './components/MoveExplorer'
import SettingsModal from './components/SettingsModal'
import { useAppState } from './contexts/AppStateContext'
import './App.css'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { state, updateBoardSize } = useAppState()

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

  return (
    <div className="app">
      <div className="app-container">
        <Menu
          onNewGame={handleNewGame}
          onSave={handleSave}
          onLoad={handleLoad}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSettings={handleSettings}
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
      </div>
    </div>
  )
}

export default App
