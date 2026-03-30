import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../store/postsSlice';
import { PostType } from '../types';
import type { AppDispatch } from '../store/store';

interface Props {
  originalPostId: number;
  userId: number;
  onCancel: () => void;
}

const RepostForm: React.FC<Props> = ({ originalPostId, userId, onCancel }) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch(addPost({
      userId,
      content,
      type: PostType.Text,
      originalPostId,
      tags: [],
    }));
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="repost-form" style={{ marginTop: '12px' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add your thoughts (optional)..."
        rows={2}
      />
      <div className="form-actions" style={{ marginTop: '8px' }}>
        <button type="submit" className="btn btn-primary">Repost</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default RepostForm;