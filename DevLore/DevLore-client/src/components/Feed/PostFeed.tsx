// src/components/DevLore.tsx
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