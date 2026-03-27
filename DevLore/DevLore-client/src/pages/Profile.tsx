import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/usersSlice';
import { fetchPosts } from '../store/postsSlice';
import type { RootState, AppDispatch } from '../store/store';
import Post from '../components/Post';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) =>
    state.users.items.find((u) => u.id === Number(userId))
  );
  const posts = useSelector((state: RootState) =>
    state.posts.items.filter((p) => p.userId === Number(userId))
  );
  const loading = useSelector((state: RootState) => state.users.loading);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUsers([Number(userId)]));
      dispatch(fetchPosts());
    }
  }, [dispatch, userId]);

  if (loading) return <div className="container">Loading profile...</div>;
  if (!user) return <div className="container">User not found</div>;

  return (
    <div className="container">
      <div className="card">
        <h1>{user.username}</h1>
        <p>{user.profile || 'No bio yet.'}</p>
        <p>Email: {user.email}</p>
      </div>
      <h2>Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Profile;