import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export interface Comment {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  User?: {
    displayName: string;
    auth0Id: string;
  };
}

export const fetchComments = async (videoId: string): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(`${API_URL}/api/videos/${videoId}/comments`);
  return response.data;
};

export const postComment = async (videoId: string, content: string, token: string): Promise<Comment> => {
  const response = await axios.post<Comment>(
    `${API_URL}/api/videos/${videoId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const likeComment = async (commentId: string, token: string): Promise<Comment> => {
  const response = await axios.post<Comment>(
    `${API_URL}/api/comments/${commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const dislikeComment = async (commentId: string, token: string): Promise<Comment> => {
  const response = await axios.post<Comment>(
    `${API_URL}/api/comments/${commentId}/dislike`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteComment = async (commentId: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
