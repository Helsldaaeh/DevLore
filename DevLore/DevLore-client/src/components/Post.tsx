import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { Post as PostType } from '../types';
import ReactionButtons from './ReactionButtons';
import CommentList from './CommentList';
import RepostForm from './RepostForm';
import { IoTrashOutline, IoCreateOutline, IoRepeatOutline } from 'react-icons/io5';

interface Props {
  post: PostType;
  onDelete?: (id: number) => void;
  currentUserId?: number;
  repostsCount?: number;
}

const Post: React.FC<Props> = ({ post, onDelete, currentUserId, repostsCount = 0 }) => {
  const navigate = useNavigate();
  const [showRepostForm, setShowRepostForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const isOwner = currentUserId === post.userId;

  const comments = useSelector((state: RootState) => state.comments.items);
  const commentsCount = comments.filter(c => c.postId === post.id).length;

  const handleEdit = () => navigate(`/edit-post/${post.id}`);
  const handleRepost = () => setShowRepostForm(!showRepostForm);
  const goToProfile = () => navigate(`/profile/${post.userId}`);
  const toggleComments = () => setShowComments(!showComments);

  const originalPost = post.originalPost;

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author">
          <button className="btn btn-link" onClick={goToProfile}>
            {post.username}
          </button>
        </div>
        <div className="post-header-actions">
          {isOwner && (
            <>
              <button className="btn" onClick={handleEdit}>
                <IoCreateOutline /> Edit
              </button>
              <button className="btn btn-danger" onClick={() => onDelete?.(post.id!)}>
                <IoTrashOutline /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {originalPost && (
        <div
          className="original-post"
          onClick={() => navigate(`/post/${originalPost.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <div className="original-post-header">
            <button
              className="btn btn-link"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${originalPost.userId}`);
              }}
            >
              <strong>{originalPost.username}</strong>
            </button>
            <span> reposted:</span>
          </div>
          <div className="original-post-content">{originalPost.content}</div>
        </div>
      )}

      {post.isRepost && !originalPost && (
        <div className="original-post deleted-original">
          <div className="original-post-header">
            <span>⚠️ Original post has been deleted</span>
          </div>
        </div>
      )}

      <div className="post-content">{post.content}</div>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-meta">
  <span>{new Date(post.createdAt!).toLocaleString()}</span>
  {post.updatedAt && post.updatedAt !== post.createdAt && (
    <span className="edited"> (edited)</span>
  )}
</div>

      <div className="post-actions">
        <ReactionButtons targetId={post.id!} targetType="post" />
        <button className="btn" onClick={handleRepost}>
          <IoRepeatOutline /> Repost ({repostsCount})
        </button>
        <button className="btn" onClick={toggleComments}>
          💬 Comments ({commentsCount})
        </button>
      </div>

      {showRepostForm && currentUserId && (
        <RepostForm
          originalPostId={post.id!}
          userId={currentUserId}
          onCancel={() => setShowRepostForm(false)}
        />
      )}

      {showComments && <CommentList postId={post.id!} />}
    </div>
  );
};

export default Post;