import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { setLoading, setResults, setError } from '../../redux/store';
import { FASTAPI_BASE_URL } from '../../config';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);
    dispatch(setLoading(true));
    console.log('SearchBar.js: handleSearch triggered, query:', query);

    const newMessage = { role: 'user', content: query, data: [] };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const response = await axiosInstance.post(
        `${FASTAPI_BASE_URL}/api/chat`,
        {
          session_id: sessionId || null,
          messages: [...messages, newMessage],
        },
        {
          headers: { Accept: 'application/json' },
          withCredentials: true,
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      console.log('SearchBar.js: Server response received:', response.data);

      const { session_id, messages: responseMessages } = response.data;
      setSessionId(session_id);
      setMessages(responseMessages);

      dispatch(
        setResults({
          query,
          results: responseMessages,
        })
      );

      setQuery('');
      setIsFocused(false);
      navigate('/search', { state: { query } });
    } catch (err) {
      console.error('SearchBar.js error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      dispatch(
        setError({
          query,
          message: err.response?.data?.detail || 'Failed to fetch response',
        })
      );
      setQuery('');
      setIsFocused(false);
      navigate('/search', { state: { query } });
    } finally {
      console.log('SearchBar.js: Finally block, setting loading to false');
      dispatch(setLoading(false));
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('SearchBar.js: Enter key pressed, triggering handleSearch');
      handleSearch();
    }
  };

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask a question (e.g., 'sales, products, users')"
      />
    </div>
  );
};

export default SearchBar;