import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setLoading, setResults, setError } from '../../redux/store';
import './SearchBar.css';
 
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
 
  const handleSearch = async () => {
    dispatch(setLoading());
    try {
      const response = await axios.post('http://localhost:5000/api/query', { query });
      dispatch(setResults(response.data));
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
        placeholder="Ask a question (e.g., 'sales this month')"
      />
    </div>
  );
};
 
export default SearchBar;