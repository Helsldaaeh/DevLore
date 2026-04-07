import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/postsSlice';
import type { RootState, AppDispatch } from '../store/store';
import Post from '../components/Post';
import { logout } from '../store/authSlice';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token && posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, token, posts.length]);

  const post = posts.find(p => p.id === Number(id));

  if (!post) return <div className="container">Post not found</div>;

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
        <button onClick={() => navigate('/search')}>🔍 Search</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </nav>
      <Post post={post} currentUserId={user?.id} />
    </div>
  );
};

export default PostDetail;