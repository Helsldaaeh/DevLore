import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePost, fetchPosts } from '../store/postsSlice';
import type { AppDispatch, RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { IoHomeOutline, IoPersonOutline, IoSettingsOutline, IoSearchOutline, IoLogOutOutline } from 'react-icons/io5';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const post = useSelector((state: RootState) =>
    state.posts.items.find(p => p.id === Number(id))
  );

  useEffect(() => {
    const loadData = async () => {
      if (post) {
        setContent(post.content);
        setTags(post.tags?.join(', ') || '');
        setLoading(false);
        return;
      }
      if (user) {
        const fetched = await dispatch(fetchPosts()).unwrap();
        const foundPost = fetched.find(p => p.id === Number(id));
        if (foundPost) {
          setContent(foundPost.content);
          setTags(foundPost.tags?.join(', ') || '');
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id, user, dispatch, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !post?.id) return;
    dispatch(updatePost({
      id: post.id,
      userId: post.userId,
      content,
      originalPostId: post.originalPostId,
      type: post.type,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    })).then(() => navigate('/feed'));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!post) return <div className="container">Post not found</div>;

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}><IoHomeOutline /> Home</button>
        <button onClick={() => navigate('/profile/' + user?.id)}><IoPersonOutline /> Profile</button>
        <button onClick={() => navigate('/settings')}><IoSettingsOutline /> Settings</button>
        <button onClick={() => navigate('/search')}><IoSearchOutline /> Search</button>
        <button onClick={handleLogout}><IoLogOutOutline /> Logout</button>
      </nav>

      <h1>Edit Post</h1>
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
          <button type="submit" className="btn btn-primary">Update</button>
          <button type="button" className="btn" onClick={() => navigate('/feed')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;