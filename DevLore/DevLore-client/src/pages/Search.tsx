// Search.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // TODO: implement search
  };

  return (
    <div className="container">
      <h1>Search</h1>
      <form onSubmit={handleSearch} className="card">
        <div className="form-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, users, tags..."
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <button className="btn" onClick={() => navigate('/feed')}>Back to Feed</button>
    </div>
  );
};
export default Search;