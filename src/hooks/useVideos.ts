// useVideos.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchVideoById } from '../services/videoService';
import { useAuth0 } from '@auth0/auth0-react';

interface Comment {
  id: string;
  content: string;
  User: {
    displayName: string;
  };
}

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  comments: Comment[];
  isFavorite?: boolean; // Assuming that the video object has an isFavorite field
}

export const useVideos = (id: string) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Create a refetch function that can be called externally to refetch the video
  const fetchVideo = useCallback(async () => {
    setLoading(true);
    try {
      let token;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }

      const fetchedVideo = await fetchVideoById(id, token);
      setVideo(fetchedVideo);
      setError(null); // Clear previous errors if fetch is successful
    } catch (err) {
      console.error('Failed to fetch video:', err);
      setError('Failed to load video.');
    } finally {
      setLoading(false);
    }
  }, [id, getAccessTokenSilently, isAuthenticated]);

  // Fetch video on initial mount
  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return { video, loading, error, refetchVideo: fetchVideo };
};
