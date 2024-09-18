import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Comment {
  id: string;
  author: string;
  content: string;
}

const Comments: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://66eb096555ad32cda47b7623.mockapi.io/videos/${videoId}/comments`);
        setComments(response.data);
      } catch (err) {
        console.error('Failed to load comments', err);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const newCommentObj: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'You',
      content: newComment,
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <div className="mt-8 text-left">
      <h3 className="text-2xl text-softRed mb-4">Comments</h3>

      {/* Display existing comments */}
      {comments.map(comment => (
        <div
          key={comment.id}
          className="mb-4 p-4 bg-white rounded-lg shadow-md text-left border border-gray-200"
        >
          <h4 className="font-semibold text-gray-700">{comment.author}</h4>
          <p className="mt-2 text-gray-600">{comment.content}</p>
        </div>
      ))}

      {/* New comment form */}
      <form onSubmit={handleCommentSubmit} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 border border-softRed rounded-lg"
          rows={3}
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-softRed text-white py-2 px-4 rounded hover:bg-softOrange"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default Comments;