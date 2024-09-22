import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import ProgressBar from './ProgressBar';

type VideoCardProps = {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
    views: number;
    isFavorite?: boolean;
  };
  toggleFavorite: () => void;
};

const VideoCard: React.FC<VideoCardProps> = ({ video, toggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const updateProgress = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration || 1;
      setProgress((currentTime / duration) * 100);
    }
  };

  // messy function to handle playback/event listeners TD: untangle the eventlistener problem
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const handlePlayError = (error: any) => {
      console.error('Error playing video:', error);
    };

    if (isPlaying) {
      videoElement.play().catch(handlePlayError);
      videoElement.addEventListener('timeupdate', updateProgress);
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
      setProgress(0);
      videoElement.removeEventListener('timeupdate', updateProgress);
    }

    // cleanup
    return () => {
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.removeEventListener('timeupdate', updateProgress);
    };
  }, [isPlaying]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(true);
    }, 250); // 250ms delay before playback starts
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  return (
    <div
      className="bg-five shadow-lg rounded-lg overflow-hidden relative videoCard"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/videos/${video.id}`}>
        <div className="relative w-full h-48 flex items-center justify-center">
          {!isPlaying && (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          )}
          {isPlaying && (
            <video
              ref={videoRef}
              src={video.videoUrl}
              muted
              loop
              className="w-full h-full object-cover"
            />
          )}
          {isHovered && <ProgressBar progress={progress} />}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-one">{video.title}</h3>
          <p className="text-sm text-gray-600">{video.views} views</p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite();
        }}
        className="absolute top-2 right-2 text-three text-xl"
      >
        {video.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
    </div>
  );
};

export default VideoCard;
