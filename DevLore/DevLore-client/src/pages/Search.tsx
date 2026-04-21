import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchPosts, clearError } from '../store/postsSlice';
import type { RootState, AppDispatch } from '../store/store';
import Post from '../components/Post';
import { logout } from '../store/authSlice';
import { IoHomeOutline, IoPersonOutline, IoCreateOutline, IoSettingsOutline, IoSearchOutline, IoLogOutOutline } from 'react-icons/io5';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: posts, loading, error } = useSelector((state: RootState) => state.posts);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchPosts({
      query: query.trim() || undefined,
      tag: tags.trim() || undefined,
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}><IoHomeOutline /> Home</button>
        <button onClick={() => navigate('/profile/' + user?.id)}><IoPersonOutline /> Profile</button>
        <button onClick={() => navigate('/create-post')}><IoCreateOutline /> Create Post</button>
        <button onClick={() => navigate('/settings')}><IoSettingsOutline /> Settings</button>
        <button onClick={handleLogout}><IoLogOutOutline /> Logout</button>
      </nav>

      <h1>Search</h1>
      <div className="card search-card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Text</label>
            <input
              type="text"
              placeholder="Search by text..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., react, typescript"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <IoSearchOutline /> Search
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => dispatch(clearError())}>Dismiss</button>
        </div>
      )}

      {loading && <p>Searching...</p>}
      {!loading && posts.length === 0 && <p>No posts found.</p>}
      {posts.map((post) => (
        <Post key={post.id} post={post} currentUserId={user?.id} />
      ))}
    </div>
  );
};

export default SearchPage;