// src/components/News.tsx
import { useState, useEffect } from 'react';
import { 
  type PostDTO, 
  fetchPosts, 
  createOrUpdatePosts, 
  deletePosts 
} from '../api/post_service';
import { 
  type UserDTO, 
  fetchUsers, 
  createOrUpdateUsers, 
  deleteUsers 
} from '../api/user_service';
import styles from '../styles/DevLore.module.css';


const DevLore = () => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [postFormData, setPostFormData] = useState<Omit<PostDTO, 'id' | 'createdAt' | 'updatedAt'>>({
    UserId: Number(),
    Content: ''
  });
  const [userFormData, setUserFormData] = useState<Omit<UserDTO, 'id' | 'createdAt' | 'updatedAt'>>({ 
    Username: '', //
    Hash_password: '', //
    Profile: '', //
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    loadUsers();
  }, []);

  const handlePostContentInputChange = (e: React.ChangeEvent<HTMLInputElement>, ) => {
    setPostFormData({ Content: e.target.value});
  };
  const handleUserUsernameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({ Username: e.target.value});
  };
  const handleUserPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({Hash_password: e.target.value});
  };
  const handleUserProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({ Profile: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const PostToSave: PostDTO = {
      id: editingId || undefined,
      UserId: postFormData.UserId,
      Content: postFormData.Content
    };
    const UserToSave: UserDTO = {
      id: editingId || undefined,
      Username: userFormData.Username,
      Hash_password: userFormData.Hash_password,
      Profile: userFormData.Profile
    };

    try {
      await createOrUpdateUsers([PostToSave]);
      await createOrUpdatePosts([PostToSave]);
      resetForm();
      await loadUsers();
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Saving failed');
    }
  };

  const handleDeleteUser = async (ids: number[]) => {
    try {
      await deleteUsers(ids);
      setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    }
  };

  const handleDeletePost = async (ids: number[]) => {
    try {
      await deletePosts(ids);
      setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    }
  };

  const resetForm = () => {
    setUserFormData({ Username: userFormData.Username,
      Hash_password: userFormData.Hash_password,
      Profile: '' });
    setPostFormData({Content: ''});
    setEditingId(null);
  };

  const setupPostEdit = (post: PostDTO) => {
    if (post.id === undefined || post.id === null) return;
    setPostFormData({
      Content: post.Content || ''
     });
    setEditingId(post.id);
  };
  
  const setupUserEdit = (user: UserDTO) => {
    if (user.id === undefined || user.id === null) return;
    setUserFormData({
      Username: user.Username,
      Hash_password: user.Hash_password,
      Profile: user.Profile || '' });
    setEditingId(user.id);
  };

  const usersToggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const postsToggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className={styles.loading}>Loading posts & users...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (<>HI</>
  );
};

export default DevLore;