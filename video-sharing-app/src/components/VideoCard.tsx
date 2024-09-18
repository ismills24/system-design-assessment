import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ id, title, thumbnail }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="bg-softPink shadow-lg rounded-lg overflow-hidden">
      <Link to={`/videos/${id}`}>
        <div className="relative w-full h-48 flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          )}
          <img
            src={thumbnail}
            alt={title}
            className={`w-full h-full object-cover ${loading ? 'hidden' : ''}`}
            onLoad={handleImageLoad}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-softRed">{title}</h3>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;