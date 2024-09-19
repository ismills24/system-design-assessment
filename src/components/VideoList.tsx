import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';
import { useSearch } from '../hooks/useSearch';
import { useAuth0 } from '@auth0/auth0-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  uploadDate: string; // or Date
  videoUrl: string;
  isFavorite?: boolean;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(videos);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch videos without requiring authentication
        const videosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos`);
        let videosData = videosResponse.data;

        // If the user is authenticated, fetch favorites
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          const favoritesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const favoriteIds = favoritesResponse.data.map((video: Video) => video.id);

          // Mark the videos that are favorited
          videosData = videosData.map((video: Video) => ({
            ...video,
            isFavorite: favoriteIds.includes(video.id),
          }));
        }

        setVideos(videosData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load videos:', err);
        setError('Failed to load videos.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, [getAccessTokenSilently, isAuthenticated]);

  const toggleFavorite = async (id: string) => {
    try {
      if (!isAuthenticated) {
        loginWithRedirect();
        return;
      }
      const token = await getAccessTokenSilently();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/videos/${id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      const updatedVideos = videos.map(video =>
        video.id === id ? { ...video, isFavorite: !video.isFavorite } : video
      );
      setVideos(updatedVideos);
    } catch (err) {
      console.error('Failed to update favorite status', err);
    }
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
          onClick={() => {
            if (!isAuthenticated) {
              loginWithRedirect();
            } else {
              setShowFavorites(!showFavorites);
            }
          }}
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
