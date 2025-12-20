import { useState } from 'react'
import Chessboard from './components/Chessboard'
import Menu from './components/Menu'
import MoveExplorer from './components/MoveExplorer'
import SettingsModal from './components/SettingsModal'
import RepertoireManager from './components/RepertoireManager'
import RepertoireSelector from './components/RepertoireSelector'
import { useAppState } from './contexts/AppStateContext'
import './App.css'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isRepertoireManagerOpen, setIsRepertoireManagerOpen] = useState(false)
  const [isRepertoireSelectorOpen, setIsRepertoireSelectorOpen] = useState(false)
  const { state, currentTheme, updateBoardSize } = useAppState()

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

  const handleSelectRepertoire = () => {
    setIsRepertoireSelectorOpen(true)
  }

  const handleCloseRepertoireSelector = () => {
    setIsRepertoireSelectorOpen(false)
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
          onSettings={handleSettings}
          onRepertoires={handleRepertoires}
          onSelectRepertoire={handleSelectRepertoire}
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
        <RepertoireSelector
          isOpen={isRepertoireSelectorOpen}
          onClose={handleCloseRepertoireSelector}
        />
      </div>
    </div>
  )
}

export default App
