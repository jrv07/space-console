import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Visualization from '../Visualization/Visualization';
import './Search.css';

const Search = () => {
  const { queryHistory, loading } = useSelector((state) => state.data);
  const latestRef = useRef(null);

  // Scroll to latest query on new results
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
                  <div className="result-section">
                    <h3>Text</h3>
                    <p>{entry.results[0]?.text || 'No text response available.'}</p>
                  </div>
                  <div className="result-section">
                    <h3>Chart</h3>
                    {entry.results[0]?.error ? (
                      <p className="error-message">{entry.results[0].error}</p>
                    ) : entry.results[0]?.data ? (
                      <Visualization
                        data={entry.results[0].data}
                        type={entry.results[0].type}
                        title={entry.results[0].title}
                      />
                    ) : (
                      <p>No chart data available.</p>
                    )}
                  </div>
                  <div className="result-section">
                    <h3>Database Query</h3>
                    <pre className="db-query">
                      {entry.results[0]?.sql || 'No query generated.'}
                    </pre>
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