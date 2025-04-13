import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setLoading, setResults, setError } from '../../redux/store';
import { API_BASE_URL } from '../../config';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false); // Track focus
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    dispatch(setLoading());
    try {
      const response = await axios.post(`${API_BASE_URL}/api/query`, { query });
      dispatch(setResults(response.data));
      navigate('/search');
    } catch (err) {
      dispatch(setError('Failed to fetch data'));
    }
  };

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask a question (e.g., 'sales, products, users')"
      />
    </div>
  );
};

export default SearchBar;