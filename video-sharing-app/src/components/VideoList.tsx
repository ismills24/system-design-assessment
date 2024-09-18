import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://66eb096555ad32cda47b7623.mockapi.io/videos');
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading videos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="video-list">
      {videos.map(video => (
        <VideoCard id={video.id} title={video.title} thumbnail={video.thumbnail} />
      ))}
    </div>
  );
};

export default VideoList;