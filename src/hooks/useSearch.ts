import { useState, useEffect, useCallback } from 'react';
import { fetchVideos, Video } from '../services/videoService';

export const useSearch = (initialVideos: Video[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from the backend when the search term changes
  const fetchSearchedVideos = useCallback(
    async (term: string) => {
      setLoading(true);
      try {
        const response = await fetchVideos(1, 20, term, false); // Fetch page 1 with a limit of 20, adjust if needed
        setVideos(response.videos);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // Fetch videos whenever the search term changes and is not empty
    if (searchTerm) {
      fetchSearchedVideos(searchTerm);
    } else {
      // Reset to initial videos when search term is cleared
      setVideos(initialVideos);
    }
  }, [searchTerm, fetchSearchedVideos, initialVideos]);

  return { searchTerm, setSearchTerm, videos, loading, error };
};
