import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import { useVideos } from '../hooks/useVideos';
import { useAuth0 } from '@auth0/auth0-react';
import { toggleFavoriteVideo } from '../services/videoService'; // Make sure to import your toggle favorite function

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { video, loading, error, fetchVideo } = useVideos(id!); // Adjust hook to allow refetching video if needed
  const [progress, setProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

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
      fetchVideo(); // Refetch the video to update the favorite status
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
          <div className="w-full h-2 bg-gray-200 rounded mt-4">
            <div className="h-full bg-softRed rounded" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleToggleFavorite}
            className="mt-4 p-2 bg-softRed text-white rounded hover:bg-red-600 transition-colors"
          >
            {video.isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>

          <Comments videoId={video.id} />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
