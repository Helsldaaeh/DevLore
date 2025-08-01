import React, { useState } from 'react';

const PostForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit({
      content,
      createdAt: new Date().toISOString()
    });
    setContent('');
  };

  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Что у вас нового?"
          rows={3}
        />
        <button type="submit">Опубликовать</button>
      </form>
    </div>
  );
};

export default PostForm;