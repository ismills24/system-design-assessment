import React, { useEffect, useState, FormEvent } from 'react';
import { fetchVideos, toggleFavoriteVideo, Video } from '../services/videoService';
import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';
import { useSearch } from '../hooks/useSearch';
import { useAuth0 } from '@auth0/auth0-react';
import InfiniteScroll from 'react-infinite-scroll-component';

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(videos);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  const fetchMoreVideos = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined;
      const limit = 20;
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
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    // Fetch initial videos
    fetchMoreVideos();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchTerm, showFavorites]);

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

  // Handle form submit for search
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (loading && page === 1) {
    return (
      <div className="video-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      id="scrollableDiv"
      className="overflow-auto h-screen px-4"
      style={{ maxHeight: '100vh' }} // Ensures the container uses the full height of the viewport
    >
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow flex">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="p-2 border border-one rounded-lg flex-1"
          />
          <button
            type="submit"
            className="ml-2 bg-one text-white py-2 px-4 rounded"
          >
            Search
          </button>
        </form>

        <button
          className="bg-three text-five py-2 px-4 rounded"
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

      <InfiniteScroll
        dataLength={filteredItems.length}
        next={fetchMoreVideos}
        hasMore={hasMore}
        loader={<p>Loading more videos...</p>}
        scrollableTarget="scrollableDiv"
      >
        <div className="video-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((video, index) => (
            <VideoCard
              key={`${video.id}-${index}`} // Ensures unique keys
              video={video}
              toggleFavorite={() => toggleFavorite(video.id)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default VideoList;
