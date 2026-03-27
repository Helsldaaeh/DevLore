import React from 'react';
import type { Post as PostType } from '../types';
import ReactionButtons from './ReactionButtons';
import CommentList from './CommentList';

interface Props {
  post: PostType;
  onDelete?: (id: number) => void;
}

const Post: React.FC<Props> = ({ post, onDelete }) => {
  return (
    <div className="post">
      <div className="post-header">
        <strong>{post.username}</strong> {/* вместо User {post.userId} */}
          {onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(post.id!)}>
            Delete
          </button>
        )}
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-meta">
        <small>Type: {post.type === 0 ? 'Text' : 'Interactive'}</small>
        {post.tags?.length ? <small> Tags: {post.tags.join(', ')}</small> : null}
      </div>
      <div className="post-actions">
        <ReactionButtons targetId={post.id!} targetType="post" />
      </div>
      <CommentList postId={post.id!} />
    </div>
  );
};

export default Post;