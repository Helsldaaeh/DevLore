import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
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
  const [showComments, setShowComments] = useState(false); // по умолчанию скрыты
  const isOwner = currentUserId === post.userId;

  // Получаем комментарии из Redux и считаем количество для этого поста
  const comments = useSelector((state: RootState) => state.comments.items);
  const commentsCount = comments.filter(c => c.postId === post.id).length;

  const handleEdit = () => navigate(`/edit-post/${post.id}`);
  const handleRepost = () => setShowRepostForm(!showRepostForm);
  const goToProfile = () => navigate(`/profile/${post.userId}`);
  const toggleComments = () => setShowComments(!showComments);

  return (
    <div className="post">
      <div className="post-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn" onClick={goToProfile} style={{ fontWeight: 'bold', background: 'none', padding: 0 }}>
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
        <div
          className="original-post"
          onClick={() => navigate(`/post/${post.originalPost?.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <div className="original-post-header" style={{ marginBottom: '8px' }}>
            <button
              className="btn"
              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.originalPost?.userId}`); }}
              style={{ fontWeight: 'bold', background: 'none', padding: 0 }}
            >
              <strong>{post.originalPost.username}</strong>
            </button>
            <span> reposted:</span>
          </div>
          <div className="original-post-content" style={{ opacity: 0.8 }}>
            {post.originalPost.content}
          </div>
        </div>
      )}

      <div className="post-content">{post.content}</div>

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

      <div className="post-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <ReactionButtons targetId={post.id!} targetType="post" />
        <button className="btn" onClick={handleRepost}>🔄 Repost</button>
        <button className="btn" onClick={toggleComments}>
          💬 Comments ({commentsCount})
        </button>
      </div>

      {showRepostForm && currentUserId && (
        <RepostForm originalPostId={post.id!} userId={currentUserId} onCancel={() => setShowRepostForm(false)} />
      )}

      {showComments && <CommentList postId={post.id!} />}
    </div>
  );
};

export default Post;