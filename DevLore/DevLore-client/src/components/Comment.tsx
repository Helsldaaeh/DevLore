import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { Comment as CommentType } from '../types';
import ReactionButtons from './ReactionButtons';
import CommentForm from './CommentForm';
import { updateComment } from '../store/commentsSlice';
import { IoTrashOutline, IoChatbubbleOutline, IoCreateOutline } from 'react-icons/io5';
import type { AppDispatch } from '../store/store';

interface Props {
  comment: CommentType;
  onDelete?: (id: number) => void;
  currentUserId?: number;
  postId: number;
}

const Comment: React.FC<Props> = ({ comment, onDelete, currentUserId, postId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const isOwner = currentUserId === comment.userId;

  const goToProfile = () => navigate(`/profile/${comment.userId}`);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    dispatch(updateComment({
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      parentCommentId: comment.parentCommentId,
      content: editContent,
    }));
    setIsEditing(false);
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <button className="btn btn-link" onClick={goToProfile}>
          <strong>{comment.username || `User ${comment.userId}`}</strong>
        </button>
        <div className="comment-meta">
          <small>{new Date(comment.createdAt!).toLocaleString()}</small>
          {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
            <small className="edited">(edited)</small>
          )}
        </div>
        {isOwner && (
          <div className="comment-actions-buttons">
            <button className="btn" onClick={() => setIsEditing(true)}>
              <IoCreateOutline /> Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete?.(comment.id!)}>
              <IoTrashOutline /> Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-comment-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={2}
            autoFocus
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}

      <div className="comment-actions">
        <ReactionButtons targetId={comment.id!} targetType="comment" />
        {currentUserId && !isEditing && (
          <button className="btn" onClick={() => setShowReplyForm(!showReplyForm)}>
            <IoChatbubbleOutline /> Reply
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