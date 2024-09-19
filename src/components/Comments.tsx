import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';

interface Comment {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  User?: {
    displayName: string;
    auth0Id: string;
  };
}

interface CommentsProps {
  videoId: string;
}

const Comments: React.FC<CommentsProps> = ({ videoId }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const { getAccessTokenSilently, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const currentUserId = user?.sub;

  // Fetch comments function
  const fetchComments = async () => {
    try {
      console.log("Fetching comments");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/videos/${videoId}/comments`
      );
      setCommentList(response.data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newComment.trim()) return;

    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/videos/${videoId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments();
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment', error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/comments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentList((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: response.data.likes }
            : comment
        )
      );
    } catch (error) {
      console.error('Failed to like comment', error);
    }
  };

  const handleDislike = async (commentId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/comments/${commentId}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentList((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, dislikes: response.data.dislikes }
            : comment
        )
      );
    } catch (error) {
      console.error('Failed to dislike comment', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCommentList((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname + window.location.search },
    });
  };

  return (
    <div className="comments-section">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>

      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Leave a comment..."
            className="comment-input"
          />
          <button
            type="submit"
            className="comment-button"
            disabled={!newComment.trim()}
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p className="text-softOrange">Please <button onClick={handleLogin} className="underline text-softRed">log in</button> to leave a comment.</p>
        </div>
      )}

      {commentList.length > 0 ? (
        commentList.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-content">
              <p className="comment-author">
                {comment.User?.auth0Id === currentUserId
                  ? `${comment.User?.displayName || ''} (You)`
                  : comment.User?.displayName || 'Anonymous'}
              </p>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-actions">
                <button onClick={() => handleLike(comment.id)} className="like-button">
                  👍 {comment.likes}
                </button>
                <button onClick={() => handleDislike(comment.id)} className="dislike-button">
                  👎 {comment.dislikes}
                </button>
                {comment.User?.auth0Id === currentUserId && (
                  <button onClick={() => handleDelete(comment.id)} className="delete-button">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-softOrange">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default Comments;
