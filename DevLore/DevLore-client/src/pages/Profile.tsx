import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/usersSlice';
import { fetchPosts, deletePost } from '../store/postsSlice';
import type { RootState, AppDispatch } from '../store/store';
import Post from '../components/Post';
import { logout } from '../store/authSlice';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) =>
    state.users.items.find((u) => u.id === Number(userId))
  );
  const allPosts = useSelector((state: RootState) => state.posts.items);
  const loading = useSelector((state: RootState) => state.users.loading);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [visiblePosts, setVisiblePosts] = useState(10);

  useEffect(() => {
    if (userId && userId !== 'me') {
      dispatch(fetchUsers([Number(userId)]));
    } else if (userId === 'me' && currentUser) {
      dispatch(fetchUsers([currentUser.id]));
    }
    dispatch(fetchPosts());
  }, [dispatch, userId, currentUser]);

  const handleDelete = (id: number) => {
    dispatch(deletePost([id]));
  };

  const userPosts = allPosts.filter((p) => p.userId === (user?.id || currentUser?.id)).slice(0, visiblePosts);
  const hasMore = allPosts.filter((p) => p.userId === (user?.id || currentUser?.id)).length > visiblePosts;

  const loadMore = () => setVisiblePosts(prev => prev + 10);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (loading) return <div className="container">Loading profile...</div>;
  if (!user && userId !== 'me') return <div className="container">User not found</div>;
  const profileUser = user || currentUser;
  if (!profileUser) return null;

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}>🏠 Home</button>
        <button onClick={() => navigate('/create-post')}>✏️ Create Post</button>
        <button onClick={() => navigate('/settings')}>⚙️ Settings</button>
        <button onClick={() => navigate('/search')}>🔍 Search</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </nav>

      <div className="card profile-header">
        <h1>{profileUser.username}</h1>
        <p>{profileUser.profile || 'No bio yet.'}</p>
        <p>Email: {profileUser.email}</p>
      </div>

      <h2>Posts</h2>
      {userPosts.length === 0 && <p>No posts yet.</p>}
      {userPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onDelete={handleDelete}
          currentUserId={currentUser?.id}
        />
      ))}
      {hasMore && (
        <button className="btn btn-primary" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Profile;