import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  uploadDate: string;
  videoUrl: string;
  isFavorite?: boolean;
}

export const fetchVideoById = async (id: string, token?: string) => {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  const response = await axios.get(`${API_URL}/api/videos/${id}`, config);
  return response.data;
};

export const fetchVideos = async (
  page: number,
  limit: number,
  searchTerm: string = '',
  showFavorites: boolean = false,
  token?: string
) => {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
const params = {
  page,
  limit,
  searchTerm,
  showFavorites
};
  const response = await axios.get(`${API_URL}/api/videos`, {
    params: {
      page,
      limit,
      searchTerm,
      showFavorites
    },
    ...config,
  });

  return response.data;
};

export const fetchFavoriteVideos = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/videos/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const toggleFavoriteVideo = async (id: string, token: string) => {
  await axios.post(`${API_URL}/api/videos/${id}/favorite`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
