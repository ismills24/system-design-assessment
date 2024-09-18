import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';
import { useSearch } from '../hooks/useSearch';  // Import the custom hook

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  isFavorite?: boolean;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(videos);  // Use the custom hook

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://66eb096555ad32cda47b7623.mockapi.io/videos');
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        const videosWithFavorites = response.data.map((video: Video) => ({
          ...video,
          isFavorite: storedFavorites[video.id] || false,
        }));
        setVideos(videosWithFavorites);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const toggleFavorite = (id: string) => {
    const updatedVideos = videos.map(video =>
      video.id === id ? { ...video, isFavorite: !video.isFavorite } : video
    );
    setVideos(updatedVideos);

    const favorites = updatedVideos.reduce((acc, video) => {
      if (video.isFavorite) acc[video.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const filteredVideos = filteredItems.filter(video => !showFavorites || video.isFavorite);

  if (loading) {
    return (
      <div className="video-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border border-softRed rounded-lg w-1/2"
        />

        {/* Favorites Toggle Button */}
        <button
          className="ml-4 bg-softRed text-white py-2 px-4 rounded"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? 'Show All Videos' : 'Show Favorites'}
        </button>
      </div>

      <div className="video-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              toggleFavorite={() => toggleFavorite(video.id)}
            />
          ))
        ) : (
          <div className="text-softRed text-lg">
            No videos match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;