import axios from 'axios';

// Fetch a specific video by ID
export const fetchVideoById = async (id: string, token?: string) => {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${id}`, config);
  return response.data;
};

// Fetch all videos
export const fetchAllVideos = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos`);
  return response.data;
};

// Fetch user's favorite videos
export const fetchFavoriteVideos = async (token: string) => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Toggle favorite status for a video
export const toggleFavoriteVideo = async (id: string, token: string) => {
  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${id}/favorite`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
