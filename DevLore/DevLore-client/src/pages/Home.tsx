import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to DevLore</h1>
      <p>A place for developers to share and interact.</p>
      <div>
        <Link to="/login">
          <button className="btn btn-primary" style={{ marginRight: '10px' }}>Login</button>
        </Link>
        <Link to="/register">
          <button className="btn">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;