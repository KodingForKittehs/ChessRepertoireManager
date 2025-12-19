import React, { useRef } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
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
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, size: 0 });

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
    <div className="chessboard-container">
      <div className="resizable-wrapper">
        <ReactChessboard 
          options={{
            boardStyle: { 
              width: `${boardSize}px`,
              height: `${boardSize}px`
            },
            darkSquareStyle: { backgroundColor: darkSquareColor },
            lightSquareStyle: { backgroundColor: lightSquareColor }
          }}
        />
        <div 
          className="resize-handle"
          onMouseDown={handleResizeStart}
          title="Drag to resize"
        />
      </div>
    </div>
  );
};

export default Chessboard;
