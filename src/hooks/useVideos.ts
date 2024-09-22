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
  isFavorite?: boolean;
}

export const useVideos = (id: string) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchVideo = useCallback(async () => {
    setLoading(true);
    try {
      let token;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }

      const fetchedVideo = await fetchVideoById(id, token);
      setVideo(fetchedVideo);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch video:', err);
      setError('Failed to load video.');
    } finally {
      setLoading(false);
    }
  }, [id, getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return { video, loading, error, refetchVideo: fetchVideo };
};
