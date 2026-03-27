import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../store/postsSlice';
import { PostType } from '../types';
import type { AppDispatch } from '../store/store';

const PostForm: React.FC<{ userId: number }> = ({ userId }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<PostType>(PostType.Text);
  const [tags, setTags] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch(
      addPost({
        userId,
        content,
        type,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
    );
    setContent('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
      />
      <div className="form-group">
        <label>Post Type</label>
        <div>
          <label>
            <input
              type="radio"
              value={PostType.Text}
              checked={type === PostType.Text}
              onChange={() => setType(PostType.Text)}
            />
            Text
          </label>
          <label style={{ marginLeft: '12px' }}>
            <input
              type="radio"
              value={PostType.Interactive}
              checked={type === PostType.Interactive}
              onChange={() => setType(PostType.Interactive)}
            />
            Interactive
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., react, typescript, dotnet"
        />
      </div>
      <button type="submit" className="btn btn-primary">Post</button>
    </form>
  );
};

export default PostForm;