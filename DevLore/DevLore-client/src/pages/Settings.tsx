import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import type { AppDispatch } from '../store/store';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [autoLoad, setAutoLoad] = useState(() => {
    const saved = localStorage.getItem('autoPaginate');
    if (saved === null) {
      localStorage.setItem('autoPaginate', 'true');
      return true;
    }
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('autoPaginate', String(autoLoad));
  }, [autoLoad]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}>🏠 Home</button>
        <button onClick={() => navigate('/profile/me')}>👤 Profile</button>
        <button onClick={() => navigate('/create-post')}>✏️ Create Post</button>
        <button onClick={() => navigate('/search')}>🔍 Search</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </nav>

      <div className="card">
        <h1>Settings</h1>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoLoad}
              onChange={(e) => setAutoLoad(e.target.checked)}
            />
            <span>  - Enable infinite scroll (auto load more posts)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;