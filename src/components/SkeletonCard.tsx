import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gray-300 animate-pulse rounded-lg shadow-lg p-4">
      <div className="w-full h-48 bg-gray-400 rounded-lg"></div>
      <div className="mt-4 h-6 bg-gray-400 rounded"></div>
      <div className="mt-2 h-4 bg-gray-400 rounded"></div>
    </div>
  );
};

export default SkeletonCard;