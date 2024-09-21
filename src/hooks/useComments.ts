// hooks/useComments.ts
import { useState, useEffect } from 'react';
import { fetchComments, postComment, likeComment, dislikeComment, deleteComment } from '../services/commentService';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
  displayName: string;
  auth0Id: string;
}

interface Comment {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  User?: User;
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (content: string) => Promise<void>;
  handleLike: (commentId: string) => Promise<void>;
  handleDislike: (commentId: string) => Promise<void>;
  handleDelete: (commentId: string) => Promise<void>;
}

export const useComments = (videoId: string): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently, user } = useAuth0();

  // Load comments from the backend
  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await fetchComments(videoId);
      setComments(data);
    } catch (error) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  // Add a new comment
  const addComment = async (content: string) => {
    try {
      const token = await getAccessTokenSilently();
      await postComment(videoId, content, token);
      loadComments();
    } catch (error) {
      setError('Failed to post comment');
    }
  };

  // Handle liking a comment
  const handleLike = async (commentId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const updatedComment = await likeComment(commentId, token);
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? { ...comment, likes: updatedComment.likes } : comment))
      );
    } catch (error) {
      setError('Failed to like comment');
    }
  };

  // Handle disliking a comment
  const handleDislike = async (commentId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const updatedComment = await dislikeComment(commentId, token);
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? { ...comment, dislikes: updatedComment.dislikes } : comment))
      );
    } catch (error) {
      setError('Failed to dislike comment');
    }
  };

  // Handle deleting a comment
  const handleDelete = async (commentId: string) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setError('Failed to delete comment');
    }
  };

  // Load comments when the video ID changes
  useEffect(() => {
    loadComments();
  }, [videoId]);

  return { comments, loading, error, addComment, handleLike, handleDislike, handleDelete };
};
