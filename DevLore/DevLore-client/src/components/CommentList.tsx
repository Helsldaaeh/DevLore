import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, deleteComment } from '../store/commentsSlice';
import type { RootState } from '../store/store';
import Comment from './Comment';
import CommentForm from './CommentForm';
import type { AppDispatch } from '../store/store';

interface Props {
  postId: number;
}

const CommentList: React.FC<Props> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.comments);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  if (loading) return <div>Loading comments...</div>;
  if (!userId) return null;

  const postComments = items.filter((c) => c.postId === postId && !c.parentCommentId);
  const getReplies = (parentId: number) => items.filter((c) => c.parentCommentId === parentId);

  const handleDelete = (id: number) => {
    dispatch(deleteComment([id]));
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <CommentForm postId={postId} userId={userId} />
      {postComments.map((comment) => (
        <div key={comment.id}>
          <Comment comment={comment} onDelete={handleDelete} />
          {getReplies(comment.id!).map((reply) => (
            <Comment key={reply.id} comment={reply} onDelete={handleDelete} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CommentList;