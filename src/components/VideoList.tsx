// VideoList.tsx
import React, { useEffect, useState } from 'react';
import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';
import { useSearch } from '../hooks/useSearch';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchAllVideos, fetchFavoriteVideos, toggleFavoriteVideo } from '../services/videoService';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  uploadDate: string;
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
        const videosData = await fetchAllVideos();
        let updatedVideos = videosData;

        // If the user is authenticated, fetch favorites and mark them
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          const favoriteVideos = await fetchFavoriteVideos(token);
          const favoriteIds = favoriteVideos.map((video: Video) => video.id);

          // Mark the videos that are favorited
          updatedVideos = videosData.map((video: Video) => ({
            ...video,
            isFavorite: favoriteIds.includes(video.id),
          }));
        }

        setVideos(updatedVideos);
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
      await toggleFavoriteVideo(id, token);

      // Update local state
      const updatedVideos = videos.map((video) =>
        video.id === id ? { ...video, isFavorite: !video.isFavorite } : video
      );
      setVideos(updatedVideos);
    } catch (err) {
      console.error('Failed to update favorite status', err);
    }
  };

  const filteredVideos = filteredItems.filter((video) => !showFavorites || video.isFavorite);

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
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-softRed rounded-lg w-1/2"
        />

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
          filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} toggleFavorite={() => toggleFavorite(video.id)} />
          ))
        ) : (
          <div className="text-softRed text-lg">No videos match your search.</div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
