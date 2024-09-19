// VideoPlayer.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import { useAuth0 } from '@auth0/auth0-react';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  User: {
    displayName: string;
  };
}

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        let config = {};
        
        // If the user is authenticated, get the access token and set the Authorization header
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        }

        // Fetch the video data
        const response = await axios.get(`http://localhost:5000/api/videos/${id}`, config);
        setVideo(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load video', err);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, getAccessTokenSilently, isAuthenticated]);

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
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {<Comments videoId={video.id} />}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
