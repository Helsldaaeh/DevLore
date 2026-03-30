import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReactions, toggleReaction } from '../store/reactionsSlice';
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
    dispatch(toggleReaction({
      userId,
      type,
      [targetType === 'post' ? 'postId' : 'commentId']: targetId,
    }));
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
    <div className="reaction-buttons">
      <button
        className={`btn ${userReaction?.type === ReactionType.Like ? 'active' : ''}`}
        onClick={() => handleReact(ReactionType.Like)}
      >
        👍 Like ({likesCount})
      </button>
      <button
        className={`btn ${userReaction?.type === ReactionType.Dislike ? 'active' : ''}`}
        onClick={() => handleReact(ReactionType.Dislike)}
      >
        👎 Dislike ({dislikesCount})
      </button>
    </div>
  );
};

export default ReactionButtons;