import React, { useState, useEffect } from 'react';
import Post from '../Post/Post.tsx';
import PostForm from '../Editors/PostEditor.tsx';
import { PostDTO } from '../../api/post.service.tsx';

const Feed = () => {
  const [posts, setPosts] = useState<PostDTO[]>([]);

  // Загрузка постов с сервера
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  // Отправка нового поста
  const handleCreatePost = (post) => {
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    .then(() => setPosts([post, ...posts]));
  };

  return (
    <div className="feed">
      <PostForm onSubmit={handleCreatePost} />
      <div className="posts-list">
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;