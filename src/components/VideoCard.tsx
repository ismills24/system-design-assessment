import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

// Define the props type for the VideoCard component
type VideoCardProps = {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    views: number;
    isFavorite?: boolean;
  };
  toggleFavorite: () => void;
};

const VideoCard: React.FC<VideoCardProps> = ({ video, toggleFavorite }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset loading state when video changes
  useEffect(() => {
    setLoading(true);
  }, [video.id]);

  // Set up an IntersectionObserver to handle lazy loading of images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    console.error('Failed to load image:', video.thumbnail);
  };

  return (
    <div className="bg-five shadow-lg rounded-lg overflow-hidden relative">
      <Link to={`/videos/${video.id}`}>
        <div className="relative w-full h-48 flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          )}
          {isVisible && (
            <img
              ref={imgRef}
              src={video.thumbnail}
              alt={video.title}
              className={`w-full h-full object-cover ${loading ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          {!isVisible && <div ref={imgRef} style={{ height: '100%', width: '100%' }} />}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-one">{video.title}</h3>
          <p className="text-sm text-gray-600">{video.views} views</p>
        </div>
      </Link>

      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 text-three text-xl"
      >
        {video.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
    </div>
  );
};

export default VideoCard;
