import React from 'react';
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
  const handleIncrease = () => {
    const newSize = Math.min(boardSize + 40, 800);
    onBoardSizeChange?.(newSize);
  };

  const handleDecrease = () => {
    const newSize = Math.max(boardSize - 40, 320);
    onBoardSizeChange?.(newSize);
  };

  const handleReset = () => {
    onBoardSizeChange?.(480);
  };

  return (
    <div className="chessboard-container">
      <div className="chessboard-controls">
        <button onClick={handleDecrease} className="size-btn" title="Decrease size">−</button>
        <button onClick={handleReset} className="size-btn" title="Reset size">⟲</button>
        <button onClick={handleIncrease} className="size-btn" title="Increase size">+</button>
      </div>
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
    </div>
  );
};

export default Chessboard;
