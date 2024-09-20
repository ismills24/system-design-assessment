// VideoPlayer.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import { useVideos } from '../hooks/useVideos';
import { useAuth0 } from '@auth0/auth0-react';
import { toggleFavoriteVideo } from '../services/videoService';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { video, loading, error, refetchVideo } = useVideos(id!);
  const [progress, setProgress] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false); // Local state for favorite status
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (video) {
      setIsFavorite(video.isFavorite ?? false); // Ensure isFavorite is always a boolean
    }
  }, [video]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await toggleFavoriteVideo(id!, token);
      setIsFavorite((prev) => !prev); // Toggle the UI state immediately
      refetchVideo(); // Refetch the video to get the latest favorite status from the server
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  if (loading) {
    return <div>Loading video...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="text-center">
      {video && (
        <>
          <h2 className="text-3xl font-bold text-one mb-4">{video.title}</h2>
          <p className="text-two mb-6">{video.description}</p>
          <div className="relative">
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              controls
              autoPlay
              className="rounded-lg shadow-lg"
              onTimeUpdate={handleTimeUpdate}
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all"
              aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
            >
              {isFavorite ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-gray-500 text-2xl" />
              )}
            </button>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded mt-4">
            <div
              className="h-full bg-softRed rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <Comments videoId={video.id} />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
