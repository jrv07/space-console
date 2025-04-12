import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setLoading, setResults, setError } from '../../redux/store';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    dispatch(setLoading());
    try {
      const response = await axios.post('{API_BASE_URL}/api/query', { query });
      dispatch(setResults(response.data));
      navigate('/search'); // Navigate to search page after query
    } catch (err) {
      dispatch(setError('Failed to fetch data'));
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Ask a question (e.g., 'sales, products, users')"
      />
    </div>
  );
};

export default SearchBar;