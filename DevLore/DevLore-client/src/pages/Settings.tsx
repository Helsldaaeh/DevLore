import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import type { AppDispatch } from '../store/store';
import { IoHomeOutline, IoPersonOutline, IoCreateOutline, IoSearchOutline, IoLogOutOutline, IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

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

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('autoPaginate', String(autoLoad));
  }, [autoLoad]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    if (isDarkTheme) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button onClick={() => navigate('/feed')}><IoHomeOutline /> Home</button>
        <button onClick={() => navigate('/profile/me')}><IoPersonOutline /> Profile</button>
        <button onClick={() => navigate('/create-post')}><IoCreateOutline /> Create Post</button>
        <button onClick={() => navigate('/search')}><IoSearchOutline /> Search</button>
        <button onClick={handleLogout}><IoLogOutOutline /> Logout</button>
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
            <span>Enable infinite scroll (auto load more posts)</span>
          </label>
        </div>

        <div className="form-group">
          <label className="theme-toggle-label">
            <span>Theme:</span>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Switch theme"
            >
              {isDarkTheme ? <IoSunnyOutline /> : <IoMoonOutline />}
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;