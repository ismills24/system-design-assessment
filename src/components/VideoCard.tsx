import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import LazyLoad from 'react-lazyload';  // Lazy loading for images
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';  // Favorite icons

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    views: number;
    isFavorite?: boolean;
  };
  toggleFavorite: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, toggleFavorite }) => {
  const [loading, setLoading] = useState<boolean>(true);  // Track image loading

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="bg-softPink shadow-lg rounded-lg overflow-hidden relative">
      {/* Link wraps the entire thumbnail and title */}
      <Link to={`/videos/${video.id}`}>
        <LazyLoad height={200} offset={100}>
          <div className="relative w-full h-48 flex items-center justify-center">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="spinner"></div>
              </div>
            )}
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`w-full h-full object-cover ${loading ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
            />
          </div>
        </LazyLoad>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-softRed">{video.title}</h3>
          <p className="text-sm text-gray-600">{video.views} views</p>
        </div>
      </Link>

      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 text-softRed text-xl"
      >
        {video.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
    </div>
  );
};

export default VideoCard;