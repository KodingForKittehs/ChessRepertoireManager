import React from 'react';
import './MoveExplorer.css';

const MoveExplorer: React.FC = () => {
  return (
    <div className="move-explorer">
      <div className="move-explorer-header">
        <h3>Move Explorer</h3>
      </div>
      <div className="move-explorer-content">
        <p className="placeholder-text">Move history and analysis will appear here</p>
      </div>
    </div>
  );
};

export default MoveExplorer;
