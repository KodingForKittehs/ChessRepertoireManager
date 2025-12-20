import { useState } from 'react'
import { useAppState } from '../contexts/AppStateContext'
import { THEMES } from '../utils/appState'
import './SettingsModal.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

function SettingsModal({
  isOpen,
  onClose
}: SettingsModalProps) {
  if (!isOpen) return null

  const { state, currentTheme, updateLightSquareColor, updateDarkSquareColor, updateTheme, exportAppState, importAppState, resetAppState } = useAppState()
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const presetThemes = [
    { name: 'Classic', light: '#f0d9b5', dark: '#b58863' },
    { name: 'Blue', light: '#dee3e6', dark: '#8ca2ad' },
    { name: 'Green', light: '#ffffdd', dark: '#86a666' },
    { name: 'Brown', light: '#f0d9b5', dark: '#946f51' },
    { name: 'Purple', light: '#e3c1d8', dark: '#9b5d87' },
    { name: 'Grey', light: '#c0c0c0', dark: '#808080' }
  ]

  const handleThemeClick = (light: string, dark: string) => {
    updateLightSquareColor(light)
    updateDarkSquareColor(dark)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleExport = () => {
    try {
      exportAppState()
      showMessage('State exported successfully!', 'success')
    } catch (error) {
      showMessage('Failed to export state', 'error')
    }
  }

  const handleImport = async () => {
    try {
      await importAppState()
      showMessage('State imported successfully!', 'success')
    } catch (error) {
      if (error instanceof Error && error.message !== 'Import cancelled') {
        showMessage(`Failed to import state: ${error.message}`, 'error')
      }
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      try {
        resetAppState()
        showMessage('Settings reset successfully!', 'success')
      } catch (error) {
        showMessage('Failed to reset settings', 'error')
      }
    }
  }

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="settings-overlay" onClick={handleOverlayClick}>
      <div 
        className="settings-modal"
        style={{
          backgroundColor: currentTheme.cardBackground,
          color: currentTheme.foreground
        }}
      >
        <div 
          className="settings-header"
          style={{
            backgroundColor: currentTheme.headerBackground,
            color: '#ffffff'
          }}
        >
          <h2>Settings</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            style={{ color: '#ffffff' }}
          >
            ×
          </button>
        </div>
        
        <div className="settings-content">
          <div className="theme-section">
            <h3>App Theme</h3>
            <div className="theme-selector">
              {Object.entries(THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  className={`theme-option ${state.preferences.theme === key ? 'active' : ''}`}
                  onClick={() => updateTheme(key)}
                  title={theme.name}
                  style={
                    state.preferences.theme === key 
                      ? { borderColor: currentTheme.accent }
                      : undefined
                  }
                >
                  <div 
                    className="theme-preview-large" 
                    style={{ background: theme.background }}
                  >
                    <div className="theme-accent" style={{ backgroundColor: theme.accent }}></div>
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
            <p className="theme-info">
              Current theme: <strong>{currentTheme.name}</strong>
            </p>
          </div>

          <div className="color-section">
            <h3>Square Colors</h3>
            
            <div className="color-picker-group">
              <div className="color-picker">
                <label htmlFor="light-square-color">Light Squares</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    id="light-square-color"
                    value={state.preferences.lightSquareColor}
                    onChange={(e) => updateLightSquareColor(e.target.value)}
                  />
                  <span className="color-value">{state.preferences.lightSquareColor}</span>
                </div>
              </div>

              <div className="color-picker">
                <label htmlFor="dark-square-color">Dark Squares</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    id="dark-square-color"
                    value={state.preferences.darkSquareColor}
                    onChange={(e) => updateDarkSquareColor(e.target.value)}
                  />
                  <span className="color-value">{state.preferences.darkSquareColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="preset-section">
            <h3>Preset Themes</h3>
            <div className="preset-themes">
              {presetThemes.map((theme) => (
                <button
                  key={theme.name}
                  className="preset-theme"
                  onClick={() => handleThemeClick(theme.light, theme.dark)}
                  title={theme.name}
                >
                  <div className="theme-preview">
                    <div 
                      className="theme-square" 
                      style={{ backgroundColor: theme.light }}
                    />
                    <div 
                      className="theme-square" 
                      style={{ backgroundColor: theme.dark }}
                    />
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="state-management-section">
            <h3>State Management</h3>
            <div className="state-buttons">
              <button 
                className="state-button export" 
                onClick={handleExport}
                style={{ backgroundColor: currentTheme.accent }}
              >
                Export Settings
              </button>
              <button 
                className="state-button import" 
                onClick={handleImport}
                style={{ backgroundColor: currentTheme.accent }}
              >
                Import Settings
              </button>
              <button className="state-button reset" onClick={handleReset}>
                Reset to Default
              </button>
            </div>
            <p className="state-info">
              Export your preferences and repertoires as a JSON file, or import a previously saved state.
            </p>
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
