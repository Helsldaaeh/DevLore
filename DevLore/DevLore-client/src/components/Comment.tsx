import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Comment as CommentType } from '../types';
import ReactionButtons from './ReactionButtons';
import CommentForm from './CommentForm';

interface Props {
  comment: CommentType;
  onDelete?: (id: number) => void;
  currentUserId?: number;
  postId: number;
}

const Comment: React.FC<Props> = ({ comment, onDelete, currentUserId, postId }) => {
  const navigate = useNavigate();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isOwner = currentUserId === comment.userId;

  const goToProfile = () => {
    navigate(`/profile/${comment.userId}`);
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <button className="btn" onClick={goToProfile} style={{ fontWeight: 'bold', background: 'none', padding: 0 }}>
          <strong>{comment.username || `User ${comment.userId}`}</strong>
        </button>
        <small>{new Date(comment.createdAt!).toLocaleString()}</small>
        {isOwner && onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(comment.id!)}>Delete</button>
        )}
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-actions" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <ReactionButtons targetId={comment.id!} targetType="comment" />
        {currentUserId && (
          <button className="btn" onClick={() => setShowReplyForm(!showReplyForm)}>
            💬 Reply
          </button>
        )}
      </div>
      {showReplyForm && currentUserId && (
        <div style={{ marginTop: '12px', marginLeft: '20px' }}>
          <CommentForm postId={postId} parentCommentId={comment.id} userId={currentUserId} onSuccess={() => setShowReplyForm(false)} />
        </div>
      )}
    </div>
  );
};

export default Comment;