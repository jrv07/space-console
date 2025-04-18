import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './Search.css';

const Search = () => {
  const { queryHistory, loading } = useSelector((state) => state.data);
  const latestRef = useRef(null);

  useEffect(() => {
    if (latestRef.current) {
      latestRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queryHistory]);

  return (
    <div className="search-page">
      <div className="search-content">
        {loading && <p className="status-message">Loading...</p>}
        {queryHistory.length > 0 ? (
          queryHistory.map((entry, index) => (
            <React.Fragment key={index}>
              <div
                className="query-entry"
                ref={index === 0 ? latestRef : null}
              >
                <div className="user-query">
                  <h2>{entry.query}</h2>
                </div>
                <div className="search-result">
                  <div className="result-section text-section">
                    <h3>Response</h3>
                    <p>{entry.results[0]?.text || entry.results[0]?.error || 'No response available.'}</p>
                  </div>
                </div>
              </div>
              {index < queryHistory.length - 1 && <hr className="separator" />}
            </React.Fragment>
          ))
        ) : !loading && (
          <p className="status-message">Enter a query to see results!</p>
        )}
      </div>
    </div>
  );
};

export default Search;