import React, { useRef, useState, useEffect } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useAppState } from '../contexts/AppStateContext';
import './Chessboard.css';

interface ChessboardProps {
  lightSquareColor?: string;
  darkSquareColor?: string;
  boardSize?: number;
  onBoardSizeChange?: (size: number) => void;
}

const Chessboard: React.FC<ChessboardProps> = ({ 
  lightSquareColor = '#f0d9b5', 
  darkSquareColor = '#b58863',
  boardSize = 560,
  onBoardSizeChange
}) => {
  const { state, currentTheme, updateRepertoire } = useAppState();
  const { updateBoardOrientation } = useAppState();
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, size: 0 });

  // Get selected repertoire
  const selectedRepertoire = state.repertoires.find(
    rep => rep.id === state.selectedRepertoireId
  );
  const isEditingMode = state.repertoireMode === 'editing' && selectedRepertoire;

  // Initialize game from repertoire when entering editing mode
  useEffect(() => {
    if (isEditingMode && selectedRepertoire) {
      const currentNodeId = state.currentPositionNodeId || selectedRepertoire.rootNodeId;
      const currentNode = selectedRepertoire.nodes[currentNodeId];
      if (currentNode) {
        const newGame = new Chess(currentNode.fen);
        setGame(newGame);
        setPosition(newGame.fen());
        setMoveHistory([]);
      }
    } else {
      const newGame = new Chess();
      setGame(newGame);
      setPosition(newGame.fen());
      setMoveHistory([]);
    }
  }, [isEditingMode, selectedRepertoire, state.currentPositionNodeId]);

  // Local orientation state driven by app preferences / repertoire
  const [orientation, setOrientation] = useState<'white' | 'black'>(
    (selectedRepertoire?.perspective as 'white' | 'black') || state.preferences.boardOrientation || 'white'
  );

  // Sync orientation when selected repertoire or preferences change
  useEffect(() => {
    const derived = (selectedRepertoire?.perspective as 'white' | 'black') || state.preferences.boardOrientation || 'white'
    setOrientation(derived)
  }, [selectedRepertoire?.id, state.preferences.boardOrientation]);

  // Handle piece drop for editing mode
  function onDrop(args: { piece: any; sourceSquare: string; targetSquare: string | null }): boolean {
    if (!isEditingMode || !selectedRepertoire || !args.targetSquare) return false;

    try {
      const move = game.move({
        from: args.sourceSquare,
        to: args.targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move === null) return false;

      // Update position and history
      setPosition(game.fen());
      setMoveHistory(prev => [...prev, move.san]);

      // Add move to repertoire
      const currentNodeId = getCurrentNodeId();
      const currentNode = selectedRepertoire.nodes[currentNodeId];
      
      if (currentNode) {
        const newNodeId = generateNodeId(game.fen());
        
        // Check if this move already exists
        const existingMove = currentNode.moves.find(m => m.uci === move.from + move.to);
        
        if (!existingMove) {
          // Create new node if it doesn't exist
          if (!selectedRepertoire.nodes[newNodeId]) {
            selectedRepertoire.nodes[newNodeId] = {
              id: newNodeId,
              fen: game.fen(),
              moves: [],
              parentMoves: [{
                fromNodeId: currentNodeId,
                san: move.san,
                uci: move.from + move.to
              }]
            };
          }

          // Add move to current node
          currentNode.moves.push({
            san: move.san,
            uci: move.from + move.to,
            targetNodeId: newNodeId,
            isMainLine: currentNode.moves.length === 0
          });

          // Update repertoire
          updateRepertoire(selectedRepertoire.id, {
            nodes: { ...selectedRepertoire.nodes }
          });
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Get current node ID based on position
  function getCurrentNodeId(): string {
    const currentFen = game.fen();
    if (!selectedRepertoire) return 'initial';
    
    // Find node with matching FEN
    for (const [nodeId, node] of Object.entries(selectedRepertoire.nodes)) {
      if (node.fen === currentFen) return nodeId;
    }
    return selectedRepertoire.rootNodeId;
  }

  // Generate node ID from FEN
  function generateNodeId(fen: string): string {
    // Simple hash function for FEN
    let hash = 0;
    for (let i = 0; i < fen.length; i++) {
      const char = fen.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `node_${Math.abs(hash).toString(36)}`;
  }

  // Reset to initial position
  function handleReset() {
    if (!isEditingMode || !selectedRepertoire) return;
    const rootNode = selectedRepertoire.nodes[selectedRepertoire.rootNodeId];
    if (rootNode) {
      const newGame = new Chess(rootNode.fen);
      setGame(newGame);
      setPosition(newGame.fen());
      setMoveHistory([]);
    }
  }

  // Undo last move
  function handleUndo() {
    if (!isEditingMode || moveHistory.length === 0) return;
    game.undo();
    setPosition(game.fen());
    setMoveHistory(prev => prev.slice(0, -1));
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      size: boardSize
    };

    const handleMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      const delta = Math.max(deltaX, deltaY);
      const newSize = Math.max(320, Math.min(800, startPosRef.current.size + delta));
      
      onBoardSizeChange?.(newSize);
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
  };

  return (
    <div 
      className="chessboard-container" 
      style={{ 
        backgroundColor: currentTheme.cardBackground 
      }}
    >
      {isEditingMode && (
        <div className="editing-mode-controls">
          <div className="editing-mode-indicator" style={{ color: currentTheme.foreground }}>
            ✏️ Editing Mode - Make moves to add to repertoire
          </div>
          <div className="editing-mode-buttons">
            <button
              className="edit-button"
              onClick={handleUndo}
              disabled={moveHistory.length === 0}
              style={{
                backgroundColor: currentTheme.accent,
                color: '#ffffff',
                opacity: moveHistory.length === 0 ? 0.5 : 1
              }}
              title="Undo last move"
            >
              ↶ Undo
            </button>
            <button
              className="edit-button"
              onClick={handleReset}
              style={{
                backgroundColor: currentTheme.accent,
                color: '#ffffff'
              }}
              title="Reset to starting position"
            >
              ⟲ Reset
            </button>
            <button
              className="edit-button flip-board-button"
              onClick={() => {
                const next = orientation === 'white' ? 'black' : 'white'
                setOrientation(next)
                updateBoardOrientation(next)
              }}
              title="Flip board"
              style={{
                backgroundColor: currentTheme.accent,
                color: '#ffffff'
              }}
            >
              ⇅ Flip
            </button>
          </div>
        </div>
      )}
      <div className="resizable-wrapper">
        <ReactChessboard 
          options={{
            position: position,
            onPieceDrop: isEditingMode ? onDrop : undefined,
            boardOrientation: orientation,
            boardStyle: { 
              width: `${boardSize}px`,
              height: `${boardSize}px`
            },
            darkSquareStyle: { backgroundColor: darkSquareColor },
            lightSquareStyle: { backgroundColor: lightSquareColor }
          }}
        />
        {!state.preferences.lockWindowResizing && (
          <div 
            className="resize-handle"
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          />
        )}
      </div>
    </div>
  );
};

export default Chessboard;
