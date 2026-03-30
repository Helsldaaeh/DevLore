import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchPosts, clearError } from '../store/postsSlice';
import type { RootState, AppDispatch } from '../store/store';
import Post from '../components/Post';
import { logout } from '../store/authSlice';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: posts, loading, error } = useSelector((state: RootState) => state.posts);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Передаём оба параметра, бэкенд должен уметь их комбинировать (OR)
    dispatch(searchPosts({
      query: query.trim() || undefined,
      tag: tags.trim() || undefined, // здесь tag – это строка, бэкенд может ожидать один тег, но для нескольких нужно расширить.
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}>🏠 Home</button>
        <button onClick={() => navigate('/profile/' + user?.id)}>👤 Profile</button>
        <button onClick={() => navigate('/create-post')}>✏️ Create Post</button>
        <button onClick={() => navigate('/settings')}>⚙️ Settings</button>
        <button onClick={handleLogout}>🚪 Logout</button>
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
          <button type="submit" className="btn btn-primary">Search</button>
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