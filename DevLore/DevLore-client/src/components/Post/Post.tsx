import React from 'react';
import 'date-fns/formatDistance';
import 'date-fns/locale/ru';
import { ru } from 'date-fns/locale/ru';
import { formatDistance } from 'date-fns/formatDistance';

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="post-header">
        <span className="author">Пользователь</span>
        <span className="timestamp">
          {formatDistance(new Date(post.createdAt), new Date(), {
            addSuffix: true,
            locale: ru
          })}
        </span>
      </div>
      <div className="post-content">{post.content}</div>
    </div>
  );
};

export default Post;