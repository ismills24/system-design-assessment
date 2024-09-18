import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`https://66eb096555ad32cda47b7623.mockapi.io/videos/${id}`);
        setVideo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load video.');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

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
          <h2 className="text-3xl font-bold text-softRed mb-4">{video.title}</h2>
          <p className="text-softOrange mb-6">{video.description}</p>
          <video autoPlay width="100%" height="auto" controls className="rounded-lg shadow-lg">
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;