import React, { useRef } from 'react'
import { useAppState } from '../contexts/AppStateContext'
import './MoveExplorer.css'

const MoveExplorer: React.FC = () => {
  const { currentTheme, state, updateMoveExplorerDimensions, navigateToPosition } = useAppState()
  const dimensions = {
    width: state.preferences.moveExplorerWidth,
    height: state.preferences.moveExplorerHeight
  }

  const isDraggingRef = useRef(false)
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const selectedRepertoire = state.repertoires.find(rep => rep.id === state.selectedRepertoireId)
  const currentNodeId = state.currentPositionNodeId || selectedRepertoire?.rootNodeId || null
  const currentNode = currentNodeId && selectedRepertoire ? selectedRepertoire.nodes[currentNodeId] : null

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    }

    const handleMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return
      const deltaX = ev.clientX - startPosRef.current.x
      const deltaY = ev.clientY - startPosRef.current.y
      const newWidth = Math.max(280, Math.min(600, startPosRef.current.width + deltaX))
      const newHeight = Math.max(300, Math.min(800, startPosRef.current.height + deltaY))
      updateMoveExplorerDimensions(newWidth, newHeight)
    }

    const handleEnd = () => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
  }

  const handleMoveClick = (targetNodeId: string) => {
    navigateToPosition(targetNodeId)
  }

  const handleBackToRoot = () => {
    if (selectedRepertoire) navigateToPosition(selectedRepertoire.rootNodeId)
  }

  const renderMoveTree = (
    nodeId: string,
    moveNumber: number = 1,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): React.ReactNode => {
    if (!selectedRepertoire) return null
    if (visited.has(nodeId)) return null

    const node = selectedRepertoire.nodes[nodeId]
    if (!node || node.moves.length === 0) return null

    const isWhiteToMove = node.fen.split(' ')[1] === 'w'
    const newVisited = new Set(visited)
    newVisited.add(nodeId)

    return (
      <div className="move-tree-node" style={{ marginLeft: `${depth * 16}px` }}>
        {node.moves.map((move, index) => {
          const isMainLine = move.isMainLine
          const isCurrentPosition = move.targetNodeId === currentNodeId

          return (
            <div key={`${move.targetNodeId}-${index}`} className="move-line">
              <span className="move-entry">
                {(isWhiteToMove || index > 0) && (
                  <span className="move-number" style={{ color: currentTheme.foreground }}>
                    {isWhiteToMove ? `${moveNumber}.` : `${moveNumber}...`}
                  </span>
                )}
                <span
                  className={`move-text ${isMainLine ? 'main-line' : 'variation'} ${isCurrentPosition ? 'current-position' : ''}`}
                  onClick={() => handleMoveClick(move.targetNodeId)}
                  style={{
                    color: isCurrentPosition ? currentTheme.accent : currentTheme.foreground,
                    fontWeight: isMainLine ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                  title={move.comment || 'Click to navigate'}
                >
                  {move.san}
                </span>
                {move.comment && (
                  <span className="move-comment" style={{ color: currentTheme.foreground }}>
                    {` {${move.comment}}`}
                  </span>
                )}
              </span>
              {renderMoveTree(
                move.targetNodeId,
                isWhiteToMove ? moveNumber + 1 : moveNumber,
                isMainLine ? depth : depth + 1,
                newVisited
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className="move-explorer"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: currentTheme.cardBackground,
        color: currentTheme.foreground
      }}
    >
      <div className="move-explorer-header" style={{ backgroundColor: currentTheme.headerBackground }}>
        <h3>Move Explorer</h3>
        {selectedRepertoire && currentNodeId !== selectedRepertoire.rootNodeId && (
          <button
            className="back-button"
            onClick={handleBackToRoot}
            style={{ backgroundColor: currentTheme.accent, color: '#ffffff' }}
            title="Back to starting position"
          >
            ⟲
          </button>
        )}
      </div>

      <div className="move-explorer-content">
        {!selectedRepertoire ? (
          <p className="placeholder-text" style={{ color: currentTheme.foreground }}>
            Select a repertoire to view moves
          </p>
        ) : (
          <>
            {currentNode && (
              <div className="position-info" style={{ color: currentTheme.foreground }}>
                <div className="current-position-label">Current Position:</div>
                {currentNode.comment && <div className="position-comment">{currentNode.comment}</div>}
                {currentNode.evaluation && <div className="position-evaluation">Eval: {currentNode.evaluation}</div>}
              </div>
            )}

            <div className="moves-display">
              {selectedRepertoire.rootNodeId && renderMoveTree(selectedRepertoire.rootNodeId)}
              {(!currentNode || currentNode.moves.length === 0) && (
                <p className="placeholder-text" style={{ color: currentTheme.foreground }}>
                  No moves in this repertoire yet. Enter editing mode to add moves.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {!state.preferences.lockWindowResizing && (
        <div className="resize-handle" onMouseDown={handleResizeStart} title="Drag to resize" />
      )}
    </div>
  )
}

export default MoveExplorer
