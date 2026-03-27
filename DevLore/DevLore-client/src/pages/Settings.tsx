// Settings.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1>Settings</h1>
      <p>This page is under construction.</p>
      <button className="btn" onClick={() => navigate('/feed')}>Back to Feed</button>
    </div>
  );
};
export default Settings;