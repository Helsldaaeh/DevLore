import { useState, useEffect } from 'react';
import { 
  type PostDTO, 
  fetchPosts, 
  createOrUpdatePosts, 
  deletePosts 
} from '../api/post.service';
import { 
  type UserDTO, 
  fetchUsers, 
  createOrUpdateUsers, 
  deleteUsers 
} from '../api/user.service';
import styles from '../styles/DevLore.module.css';

const UserProfile = (id:number) =>{
  const ChosenUserId = id;
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
    Username: '',
    Hash_password: '',
    Profile: '',
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
const Profile = () => { return users[id].Profile; }
  return (
  <Profile/>
  );
}
export default UserProfile;