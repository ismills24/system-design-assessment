// ProgressBar.tsx
import React from 'react';

type ProgressBarProps = {
  progress: number; // 0 to 100
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-1 bg-four">
      <div className="h-full bg-three" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
