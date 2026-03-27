import React from 'react';
import type { Comment as CommentType } from '../types';
import ReactionButtons from './ReactionButtons';

interface Props {
  comment: CommentType;
  onDelete?: (id: number) => void;
}

const Comment: React.FC<Props> = ({ comment, onDelete }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <strong>User {comment.userId}</strong>
        <small>{new Date(comment.createdAt!).toLocaleString()}</small>
        {onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(comment.id!)}>
            Delete
          </button>
        )}
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="post-actions">
        <ReactionButtons targetId={comment.id!} targetType="comment" />
      </div>
    </div>
  );
};

export default Comment;