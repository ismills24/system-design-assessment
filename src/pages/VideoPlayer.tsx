import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';  // Import the Comments component

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);  // Progress state for video playback
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`https://66eb096555ad32cda47b7623.mockapi.io/videos/${id}`);
        setVideo(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load video', err);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100);  // Calculate video progress as percentage
    }
  };

  if (loading) {
    return <div>Loading video...</div>;
  }

  return (
    <div className="text-center">
      {video && (
        <>
          <h2 className="text-3xl font-bold text-softRed mb-4">{video.title}</h2>
          <p className="text-softOrange mb-6">{video.description}</p>
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
            <div
              className="h-full bg-softRed rounded"
              style={{ width: `${progress}%` }}  // Progress bar width based on video progress
            ></div>
          </div>

          {/* Comments Section */}
          <Comments videoId={id!} />  {/* Pass the video ID to the Comments component */}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;