import { useState } from 'react'
import Chessboard from './components/Chessboard'
import Menu from './components/Menu'
import './App.css'

function App() {
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
    console.log('Settings clicked')
    // TODO: Implement settings logic
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
        <Chessboard />
      </div>
    </div>
  )
}

export default App
