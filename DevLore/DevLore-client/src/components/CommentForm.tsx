import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../store/commentsSlice';
import type { AppDispatch } from '../store/store';

interface Props {
  postId: number;
  parentCommentId?: number | null;
  userId: number;
}

const CommentForm: React.FC<Props> = ({ postId, parentCommentId, userId }) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch(
      addComment({
        userId,
        postId,
        parentCommentId: parentCommentId || null,
        content,
      })
    );
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '12px' }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit" className="btn" style={{ marginTop: '6px' }}>
        Comment
      </button>
    </form>
  );
};

export default CommentForm;