import React, { useState, useRef } from 'react';
import './MoveExplorer.css';

const MoveExplorer: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 320, height: 400 });
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    };

    const handleMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      const newWidth = Math.max(280, Math.min(600, startPosRef.current.width + deltaX));
      const newHeight = Math.max(300, Math.min(800, startPosRef.current.height + deltaY));
      
      setDimensions({ width: newWidth, height: newHeight });
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
    <div className="move-explorer" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
      <div className="move-explorer-header">
        <h3>Move Explorer</h3>
      </div>
      <div className="move-explorer-content">
        <p className="placeholder-text">Move history and analysis will appear here</p>
      </div>
      <div 
        className="resize-handle"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
      />
    </div>
  );
};

export default MoveExplorer;
