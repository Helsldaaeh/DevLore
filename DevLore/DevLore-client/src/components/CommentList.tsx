import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, deleteComment } from '../store/commentsSlice';
import type { RootState, AppDispatch } from '../store/store';
import Comment from './Comment';
import CommentForm from './CommentForm';
import type { Comment as CommentType } from '../types';

interface Props {
  postId: number;
}

const CommentList: React.FC<Props> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.comments);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  if (loading) return <div>Loading comments...</div>;
  if (!currentUser) return null;

  const topLevelComments = items.filter(c => c.postId === postId && !c.parentCommentId);
  const repliesMap = new Map<number, CommentType[]>();
  items.forEach(c => {
    if (c.parentCommentId) {
      if (!repliesMap.has(c.parentCommentId)) repliesMap.set(c.parentCommentId, []);
      repliesMap.get(c.parentCommentId)!.push(c);
    }
  });

  const MAX_MARGIN = 60; // Максимальный отступ, чтобы не сжимать комментарии
  const renderCommentWithReplies = (comment: CommentType, level = 0) => {
    const marginLeft = Math.min(level * 20, MAX_MARGIN);
    return (
      <div key={comment.id} style={{ marginLeft: `${marginLeft}px`, minWidth: 0 }}>
        <Comment
          comment={comment}
          onDelete={(id) => dispatch(deleteComment([id]))}
          currentUserId={currentUser.id}
          postId={postId}
        />
        {repliesMap.get(comment.id!)?.map(reply => renderCommentWithReplies(reply, level + 1))}
      </div>
    );
  };

  return (
    <div style={{ marginTop: '16px', overflowX: 'hidden' }}>
      <CommentForm postId={postId} userId={currentUser.id} />
      {topLevelComments.map(comment => renderCommentWithReplies(comment))}
    </div>
  );
};

export default CommentList;