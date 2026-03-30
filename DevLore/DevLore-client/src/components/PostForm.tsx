import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../store/postsSlice';
import { PostType } from '../types';
import type { AppDispatch } from '../store/store';

const PostForm: React.FC<{ userId: number }> = ({ userId }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch(
      addPost({
        userId,
        content,
        type: PostType.Text, // всегда текст, убрали выбор
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
    );
    setContent('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
      </div>
      <button type="submit" className="btn btn-primary">Post</button>
    </form>
  );
};

export default PostForm;