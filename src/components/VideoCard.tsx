import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import ProgressBar from './ProgressBar'; // Import the ProgressBar component

type VideoCardProps = {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string; // Add video URL for preview
    views: number;
    isFavorite?: boolean;
  };
  toggleFavorite: () => void;
};

const VideoCard: React.FC<VideoCardProps> = ({ video, toggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state for the progress bar
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Function to update progress based on video's current time
  const updateProgress = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration || 1; // Prevent division by zero
      setProgress((currentTime / duration) * 100);
    }
  };

  // Handle video playback and event listeners based on isPlaying state
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    if (isPlaying) {
      // Start playing video and add event listener
      videoElement.play();
      videoElement.addEventListener('timeupdate', updateProgress);
    } else {
      // Pause video and reset progress
      videoElement.pause();
      videoElement.currentTime = 0;
      setProgress(0);
      videoElement.removeEventListener('timeupdate', updateProgress);
    }

    // Cleanup in case the component unmounts
    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
    };
  }, [isPlaying]);

  // Function to handle mouse enter with delay
  const handleMouseEnter = () => {
    setIsHovered(true);

    // Set a delay before starting the video playback
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(true);
    }, 250); // 250ms delay before playback starts
  };

  // Function to handle mouse leave and clear the delay
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);

    // Clear the timeout if the user stops hovering before the delay
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
          e.preventDefault(); // Prevent navigation when clicking the favorite button
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
