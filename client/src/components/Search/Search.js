import React from 'react';
import { useSelector } from 'react-redux';
import Visualization from '../Visualization/Visualization';
import './Search.css';

const Search = () => {
  const { results, loading, error } = useSelector((state) => state.data);

  return (
    <div className="search-page">
      <div className="search-content">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {results && !results.error && (
          <Visualization data={results.data} type={results.type} title={results.title} />
        )}
        {results && results.error && <p>{results.error}</p>}
        {!loading && !error && !results && <p>Enter a query to see results!</p>}
      </div>
    </div>
  );
};

export default Search;