import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../store/commentsSlice';
import type { AppDispatch } from '../store/store';

interface Props {
  postId: number;
  parentCommentId?: number | null;
  userId: number;
  onSuccess?: () => void;
}

const CommentForm: React.FC<Props> = ({ postId, parentCommentId, userId, onSuccess }) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch(addComment({
      userId,
      postId,
      parentCommentId: parentCommentId || null,
      content,
    })).then(() => {
      setContent('');
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'flex-start' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={1}
        style={{ flex: 1, resize: 'vertical', minHeight: '38px' }}
      />
      <button type="submit" className="btn" style={{ padding: '8px 12px', height: '38px' }}>
        ➤
      </button>
    </form>
  );
};

export default CommentForm;