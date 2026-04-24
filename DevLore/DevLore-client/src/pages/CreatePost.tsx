import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../store/postsSlice';
import type { AppDispatch, RootState } from '../store/store';
import { PostType } from '../types';
import { logout } from '../store/authSlice';
import { IoHomeOutline, IoPersonOutline, IoCreateOutline, IoSettingsOutline, IoSearchOutline, IoLogOutOutline } from 'react-icons/io5';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !userId) return;
    dispatch(
      addPost({
        userId,
        content,
        type: PostType.Text,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      })
    );
    navigate('/feed');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}><IoHomeOutline /> Home</button>
        <button onClick={() => navigate('/profile/' + user.id)}><IoPersonOutline /> Profile</button>
        <button onClick={() => navigate('/settings')}><IoSettingsOutline /> Settings</button>
        <button onClick={() => navigate('/search')}><IoSearchOutline /> Search</button>
        <button onClick={handleLogout}><IoLogOutOutline /> Logout</button>
      </nav>

      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />
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
        <div className="form-actions">
          <button type="submit" className="btn btn-primary"><IoCreateOutline /> Publish</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;