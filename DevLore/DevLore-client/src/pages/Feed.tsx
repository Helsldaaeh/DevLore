import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, deletePost } from '../store/postsSlice';
import { logout } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store/store';
import Post from '../components/Post';
import PostForm from '../components/PostForm';

const Feed: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: posts, loading } = useSelector((state: RootState) => state.posts);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchPosts());
    }
  }, [dispatch, token]);

  const handleDelete = (id: number) => {
    dispatch(deletePost([id]));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}>🏠 Home</button>
        <button onClick={() => navigate('/profile/' + user.id)}>👤 Profile</button>
        <button onClick={() => navigate('/settings')}>⚙️ Settings</button>
        <button onClick={() => navigate('/search')}>🔍 Search</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </nav>
      <h1>Feed</h1>
      <PostForm userId={user.id} />
      {loading && <p>Loading posts...</p>}
      {!loading && posts.length === 0 && <p>No posts yet. Be the first to create one!</p>}
      {posts.map((post) => (
        <Post key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default Feed;