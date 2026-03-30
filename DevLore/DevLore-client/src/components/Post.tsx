import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post as PostType } from '../types';
import ReactionButtons from './ReactionButtons';
import CommentList from './CommentList';
import RepostForm from './RepostForm';

interface Props {
  post: PostType;
  onDelete?: (id: number) => void;
  currentUserId?: number;
}

const Post: React.FC<Props> = ({ post, onDelete, currentUserId }) => {
  const navigate = useNavigate();
  const [showRepostForm, setShowRepostForm] = useState(false);
  const isOwner = currentUserId === post.userId;

  const handleEdit = () => navigate(`/edit-post/${post.id}`);
  const handleRepost = () => setShowRepostForm(!showRepostForm);
  const goToProfile = () => navigate(`/profile/${post.userId}`);

  return (
    <div className="post">
      <div className="post-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Аватар (если есть) – можно добавить позже */}
          <button className="btn" onClick={goToProfile} style={{ fontWeight: 'bold' }}>
            {post.username}
          </button>
        </div>
        <div className="post-header-actions">
          {isOwner && (
            <>
              <button className="btn" onClick={handleEdit}>✏️ Edit</button>
              <button className="btn btn-danger" onClick={() => onDelete?.(post.id!)}>Delete</button>
            </>
          )}
        </div>
      </div>

      {post.originalPost && (
        <div className="original-post" style={{ borderLeft: '3px solid #ccc', paddingLeft: '12px', marginBottom: '12px' }}>
          <strong>{post.originalPost.username}</strong>
          <div className="post-content">{post.originalPost.content}</div>
        </div>
      )}

      <div className="post-content">
        {post.content || (post.originalPost ? 'Reposted' : '')}
      </div>

      {post.media && post.media.length > 0 && (
        <div className="post-media" style={{ margin: '12px 0' }}>
          {post.media.map((url, idx) => {
            if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
              return <img key={idx} src={url} alt="media" style={{ maxWidth: '100%', borderRadius: '12px' }} />;
            } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
              return <video key={idx} src={url} controls style={{ maxWidth: '100%' }} />;
            } else {
              return <a key={idx} href={url} target="_blank" rel="noopener noreferrer">📎 Download</a>;
            }
          })}
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-meta">
        <span>{new Date(post.createdAt!).toLocaleString()}</span>
      </div>

      <div className="post-actions" style={{ display: 'flex', gap: '12px' }}>
        <ReactionButtons targetId={post.id!} targetType="post" />
        <button className="btn" onClick={handleRepost}>🔄 Repost</button>
      </div>

      {showRepostForm && currentUserId && (
        <RepostForm originalPostId={post.id!} userId={currentUserId} onCancel={() => setShowRepostForm(false)} />
      )}

      <CommentList postId={post.id!} />
    </div>
  );
};

export default Post;