import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, deletePost } from '../store/postsSlice';
import { fetchComments } from '../store/commentsSlice';
import { logout } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store/store';
import Post from '../components/Post';

const Feed: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: posts, loading } = useSelector((state: RootState) => state.posts);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const [visibleCount, setVisibleCount] = useState(10);
  const [autoLoad, setAutoLoad] = useState(() => {
    const saved = localStorage.getItem('autoPaginate');
    return saved === 'true';
  });

  // Вычисляем количество репостов для каждого поста
  const repostsCountMap = useMemo(() => {
    const map = new Map<number, number>();
    posts.forEach(post => {
      if (post.originalPostId) {
        const originalId = post.originalPostId;
        map.set(originalId, (map.get(originalId) || 0) + 1);
      }
    });
    return map;
  }, [posts]);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('autoPaginate');
      setAutoLoad(saved === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchPosts());
      dispatch(fetchComments());
    }
  }, [dispatch, token]);

  const handleDelete = (id: number) => {
    dispatch(deletePost([id]));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const observerTarget = useRef<HTMLDivElement>(null);
  const observerCallback: IntersectionObserverCallback = useCallback((entries) => {
    if (entries[0].isIntersecting && autoLoad && !loading && posts.length > visibleCount) {
      loadMore();
    }
  }, [autoLoad, loading, posts.length, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [observerCallback]);

  if (!user && token) return <div className="container">Loading profile...</div>;
  if (!user) return null;

  const displayedPosts = posts.slice(0, visibleCount);
  const hasMore = posts.length > visibleCount;

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/profile/' + user.id)}>👤 Profile</button>
        <button onClick={() => navigate('/create-post')}>✏️ Create Post</button>
        <button onClick={() => navigate('/settings')}>⚙️ Settings</button>
        <button onClick={() => navigate('/search')}>🔍 Search</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </nav>

      <h1>Feed</h1>

      {loading && <p>Loading posts...</p>}
      {!loading && posts.length === 0 && <p>No posts yet. Be the first to create one!</p>}
      {displayedPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onDelete={handleDelete}
          currentUserId={user.id}
          repostsCount={repostsCountMap.get(post.id!) || 0}
        />
      ))}
      {hasMore && !autoLoad && !loading && (
        <button className="btn btn-primary" onClick={loadMore}>
          Load more
        </button>
      )}
      {hasMore && autoLoad && <div ref={observerTarget} style={{ height: '20px' }} />}
    </div>
  );
};

export default Feed;