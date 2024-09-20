// VideoPlayer.tsx
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import { useVideos } from '../hooks/useVideos';

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { video, loading, error } = useVideos(id!);
  const [progress, setProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100);
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
          <Comments videoId={video.id} />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
