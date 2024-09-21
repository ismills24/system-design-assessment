// Comments.tsx
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useComments } from '../hooks/useComments';

interface CommentsProps {
  videoId: string;
}

const Comments: React.FC<CommentsProps> = ({ videoId }) => {
  const [newComment, setNewComment] = useState<string>('');
  const { comments, loading, error, addComment, handleLike, handleDislike, handleDelete } = useComments(videoId);
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const currentUserId = user?.sub;

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newComment.trim()) return;

    await addComment(newComment);
    setNewComment('');
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p className="text-primary">{error}</p>;
  }

  return (
    <div className="comments-section">
      <h3 className="text-2xl font-semibold text-five mb-4">Comments</h3>

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
        <div className="login-prompt bg-five p-3 rounded-md mt-4">
          <p>
            Please{' '}
            <button
              onClick={() => loginWithRedirect()}
              className="underline text-two"
            >
              log in
            </button>{' '}
            to leave a comment.
          </p>
        </div>
      )}

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment-card p-4 mb-2 bg-white rounded-lg shadow-sm">
            <div className="comment-content">
              <p className="comment-author text-one font-semibold">
                {comment.User?.auth0Id === currentUserId
                  ? `${comment.User?.displayName || ''} (You)`
                  : comment.User?.displayName || 'Anonymous'}
              </p>
              <p className="comment-text text-gray-700">{comment.content}</p>
              <div className="comment-actions flex gap-2 mt-2">
                <button
                  onClick={() => handleLike(comment.id)}
                  className="like-button bg-one text-white px-2 py-1 rounded"
                >
                  👍 {comment.likes}
                </button>
                <button
                  onClick={() => handleDislike(comment.id)}
                  className="dislike-button bg-one text-white px-2 py-1 rounded"
                >
                  👎 {comment.dislikes}
                </button>
                {comment.User?.auth0Id === currentUserId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="delete-button bg-two text-white px-2 py-1 rounded ml-auto"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-five">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default Comments;
