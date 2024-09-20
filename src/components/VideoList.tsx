import React, { useEffect, useState } from 'react';
import { fetchVideos, toggleFavoriteVideo, Video } from '../services/videoService';
import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';
import { useSearch } from '../hooks/useSearch';
import { useAuth0 } from '@auth0/auth0-react';

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(videos);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  const fetchMoreVideos = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined;
      const limit = 10;
      const response = await fetchVideos(page, limit, searchTerm, showFavorites, token);

      if (response.videos.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prevVideos) => [...prevVideos, ...response.videos]);
        setPage((prevPage) => prevPage + 1);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('Failed to load videos.');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMoreVideos();
    // Disable body scrolling when this component is mounted
    document.body.style.overflow = 'hidden';

    // Re-enable body scrolling when this component is unmounted
    return () => {
      document.body.style.overflow = '';
    };
  }, [getAccessTokenSilently, isAuthenticated, searchTerm, showFavorites]);

  const toggleFavorite = async (id: string) => {
    try {
      if (!isAuthenticated) {
        loginWithRedirect();
        return;
      }
      const token = await getAccessTokenSilently();
      await toggleFavoriteVideo(id, token);

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === id ? { ...video, isFavorite: !video.isFavorite } : video
        )
      );
    } catch (err) {
      console.error('Failed to update favorite status', err);
    }
  };

  if (loading && page === 1) {
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
    <div
      onScroll={(e) => {
        const target = e.target as HTMLElement;
        if (target.scrollHeight - target.scrollTop === target.clientHeight && hasMore) {
          fetchMoreVideos();
        }
      }}
      className="overflow-auto h-screen px-4"
      style={{ maxHeight: '100vh' }} // Ensures the container uses the full height of the viewport
    >
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
        {filteredItems.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            toggleFavorite={() => toggleFavorite(video.id)}
          />
        ))}
      </div>
      {loading && <p>Loading more videos...</p>}
    </div>
  );
};

export default VideoList;
