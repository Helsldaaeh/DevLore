import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiClient } from '../api/client';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';
import { IoHomeOutline, IoPersonOutline, IoCreateOutline, IoSettingsOutline, IoSearchOutline, IoLogOutOutline, IoTrashOutline } from 'react-icons/io5';
import debounce from 'lodash/debounce';

interface User {
  id: number;
  username: string;
  email: string;
  profile: string;
  roleName: string;
  createdAt: string;
}

interface Post {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
  type: number;
  tags: string[];
}

interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  postId: number;
  postContent: string;
  createdAt: string;
}

interface StatsResponse {
  Users: number;
  Posts: number;
  Comments: number;
  Reactions: number;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'comments' | 'stats'>('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Фильтры и пагинация
  const [userSearch, setUserSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [postTag, setPostTag] = useState('');
  const [commentSearch, setCommentSearch] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const take = 20;

  useEffect(() => {
    if (currentUser?.roleName !== 'Admin') {
      navigate('/feed');
    }
  }, [currentUser, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await apiClient.get('/api/admin/users', {
          params: { search: userSearch || undefined, skip: page * take, take }
        });
        setUsers(res.data.items);
        setTotal(res.data.total);
      } else if (activeTab === 'posts') {
        const res = await apiClient.get('/api/admin/posts', {
          params: { search: postSearch || undefined, author: postAuthor || undefined, tag: postTag || undefined, skip: page * take, take }
        });
        setPosts(res.data.items);
        setTotal(res.data.total);
      } else if (activeTab === 'comments') {
        const res = await apiClient.get('/api/admin/comments', {
          params: { search: commentSearch || undefined, author: commentAuthor || undefined, skip: page * take, take }
        });
        setComments(res.data.items);
        setTotal(res.data.total);
      } else if (activeTab === 'stats') {
        const res = await apiClient.get('/api/admin/stats');
        setStats(res.data);
      }
    } finally {
      setLoading(false);
    }
    setSelectedIds(new Set());
  }, [activeTab, page, userSearch, postSearch, postAuthor, postTag, commentSearch, commentAuthor]);

  const debouncedFetch = useCallback(debounce(() => { setPage(0); fetchData(); }, 500), [fetchData]);

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [userSearch, postSearch, postAuthor, postTag, commentSearch, commentAuthor, activeTab]);

  useEffect(() => {
    fetchData();
  }, [page, activeTab]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Delete user? All their data will be lost.')) return;
    await apiClient.delete(`/api/admin/users/${id}`);
    fetchData();
  };

  const handleDeleteUsersBatch = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} users?`)) return;
    await apiClient.delete('/api/admin/users/batch', { data: Array.from(selectedIds) });
    fetchData();
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Delete post?')) return;
    await apiClient.delete(`/api/admin/posts/${id}`);
    fetchData();
  };

  const handleDeletePostsBatch = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} posts?`)) return;
    await apiClient.delete('/api/admin/posts/batch', { data: Array.from(selectedIds) });
    fetchData();
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Delete comment?')) return;
    await apiClient.delete(`/api/admin/comments/${id}`);
    fetchData();
  };

  const handleDeleteCommentsBatch = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} comments?`)) return;
    await apiClient.delete('/api/admin/comments/batch', { data: Array.from(selectedIds) });
    fetchData();
  };

  const handleSetRole = async (userId: number, role: string) => {
    await apiClient.put(`/api/admin/users/${userId}/role`, role, { headers: { 'Content-Type': 'application/json' } });
    fetchData();
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAllUsers = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map(u => u.id)));
    }
  };

  const toggleSelectAllPosts = () => {
    if (selectedIds.size === posts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map(p => p.id)));
    }
  };

  const toggleSelectAllComments = () => {
    if (selectedIds.size === comments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(comments.map(c => c.id)));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (currentUser?.roleName !== 'Admin') return null;

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}><IoHomeOutline /> Home</button>
        <button onClick={() => navigate('/profile/' + currentUser.id)}><IoPersonOutline /> Profile</button>
        <button onClick={() => navigate('/create-post')}><IoCreateOutline /> Create Post</button>
        <button onClick={() => navigate('/settings')}><IoSettingsOutline /> Settings</button>
        <button onClick={() => navigate('/search')}><IoSearchOutline /> Search</button>
        <button onClick={handleLogout}><IoLogOutOutline /> Logout</button>
      </nav>

      <h1>Admin Panel</h1>

      <div className="admin-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'stats' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`btn ${activeTab === 'posts' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('posts')}>Posts</button>
        <button className={`btn ${activeTab === 'comments' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('comments')}>Comments</button>
      </div>

      {loading && <p>Loading...</p>}

      {activeTab === 'stats' && stats && (
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '16px' }}>
          <div className="card"><h3>Users</h3><p>{stats.Users}</p></div>
          <div className="card"><h3>Posts</h3><p>{stats.Posts}</p></div>
          <div className="card"><h3>Comments</h3><p>{stats.Comments}</p></div>
          <div className="card"><h3>Reactions</h3><p>{stats.Reactions}</p></div>
        </div>
      )}

      {activeTab === 'users' && (
        <>
          <div className="search-bar" style={{ marginBottom: '16px' }}>
            <input type="text" placeholder="Search by username or email" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} style={{ width: '100%' }} />
          </div>
          {selectedIds.size > 0 && <button className="btn btn-danger" onClick={handleDeleteUsersBatch} style={{ marginBottom: '16px' }}>Delete selected ({selectedIds.size})</button>}
          <div className="admin-table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th><input type="checkbox" onChange={toggleSelectAllUsers} checked={selectedIds.size === users.length && users.length > 0} /></th>
                  <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td><input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => toggleSelect(u.id)} /></td>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <select value={u.roleName} onChange={(e) => handleSetRole(u.id, e.target.value)}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-danger" onClick={() => handleDeleteUser(u.id)}><IoTrashOutline /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button className="btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span>Page {page + 1}</span>
            <button className="btn" disabled={(page+1)*take >= total} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}

      {activeTab === 'posts' && (
        <>
          <div className="search-bar" style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search by content" value={postSearch} onChange={(e) => setPostSearch(e.target.value)} style={{ flex: 1 }} />
            <input type="text" placeholder="Author username" value={postAuthor} onChange={(e) => setPostAuthor(e.target.value)} style={{ flex: 1 }} />
            <input type="text" placeholder="Tag" value={postTag} onChange={(e) => setPostTag(e.target.value)} style={{ flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {selectedIds.size > 0 && <button className="btn btn-danger" onClick={handleDeletePostsBatch}>Delete selected ({selectedIds.size})</button>}
            <button className="btn" onClick={toggleSelectAllPosts}>Select all</button>
          </div>
          <div className="admin-table">
            {posts.map(p => (
              <div key={p.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><strong>{p.authorUsername}</strong> - {new Date(p.createdAt).toLocaleString()}</div>
                  <div><input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} /></div>
                </div>
                <div className="post-content">{p.content}</div>
                <div className="post-meta">Tags: {p.tags.join(', ')}</div>
                <button className="btn btn-danger" onClick={() => handleDeletePost(p.id)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="pagination" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button className="btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span>Page {page + 1}</span>
            <button className="btn" disabled={(page+1)*take >= total} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}

      {activeTab === 'comments' && (
        <>
          <div className="search-bar" style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search by content" value={commentSearch} onChange={(e) => setCommentSearch(e.target.value)} style={{ flex: 1 }} />
            <input type="text" placeholder="Author username" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} style={{ flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {selectedIds.size > 0 && <button className="btn btn-danger" onClick={handleDeleteCommentsBatch}>Delete selected ({selectedIds.size})</button>}
            <button className="btn" onClick={toggleSelectAllComments}>Select all</button>
          </div>
          <div className="admin-table">
            {comments.map(c => (
              <div key={c.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><strong>{c.authorUsername}</strong> on post #{c.postId} - {new Date(c.createdAt).toLocaleString()}</div>
                  <div><input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} /></div>
                </div>
                <div className="comment-content">{c.content}</div>
                <button className="btn btn-danger" onClick={() => handleDeleteComment(c.id)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="pagination" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button className="btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span>Page {page + 1}</span>
            <button className="btn" disabled={(page+1)*take >= total} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;