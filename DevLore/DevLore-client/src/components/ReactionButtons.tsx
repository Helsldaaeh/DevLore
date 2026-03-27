import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReactions, addReaction, deleteReaction } from '../store/reactionsSlice';
import type { RootState } from '../store/store';
import { ReactionType } from '../types';
import type { AppDispatch } from '../store/store';

interface Props {
  targetId: number;
  targetType: 'post' | 'comment';
}

const ReactionButtons: React.FC<Props> = ({ targetId, targetType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const reactions = useSelector((state: RootState) => state.reactions.items);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (userId) dispatch(fetchReactions());
  }, [dispatch, userId]);

  if (!userId) return null;

  const userReaction = reactions.find(
    (r) => r.userId === userId && (targetType === 'post' ? r.postId === targetId : r.commentId === targetId)
  );

  const handleReact = (type: ReactionType) => {
    if (userReaction) {
      dispatch(deleteReaction([userReaction.id!]));
    }
    dispatch(
      addReaction({
        userId,
        type,
        [targetType === 'post' ? 'postId' : 'commentId']: targetId,
      })
    );
  };

  const likesCount = reactions.filter(
    (r) =>
      (targetType === 'post' ? r.postId === targetId : r.commentId === targetId) &&
      r.type === ReactionType.Like
  ).length;

  const dislikesCount = reactions.filter(
    (r) =>
      (targetType === 'post' ? r.postId === targetId : r.commentId === targetId) &&
      r.type === ReactionType.Dislike
  ).length;

  return (
    <div className="reaction-buttons" style={{ display: 'flex', gap: '8px' }}>
      <button
        className="btn"
        onClick={() => handleReact(ReactionType.Like)}
        style={{ color: userReaction?.type === ReactionType.Like ? 'blue' : 'black' }}
      >
        👍 Like ({likesCount})
      </button>
      <button
        className="btn"
        onClick={() => handleReact(ReactionType.Dislike)}
        style={{ color: userReaction?.type === ReactionType.Dislike ? 'red' : 'black' }}
      >
        👎 Dislike ({dislikesCount})
      </button>
    </div>
  );
};

export default ReactionButtons;