import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCopy, FaCheck } from 'react-icons/fa';
import './Search.css';

const Search = () => {
  const { queryHistory, loading } = useSelector((state) => state.data);
  const latestRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (latestRef.current) {
      latestRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queryHistory]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const renderContent = (content) => {
    console.log('renderContent input:', content); // Debug: Log raw content

    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)\s*```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let codeIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [fullMatch, , code] = match; // Ignore language capture group
      const startIndex = match.index;
      const endIndex = codeBlockRegex.lastIndex;

      console.log('Code block match:', { fullMatch, code, startIndex, endIndex }); // Debug: Log match details

      if (startIndex > lastIndex) {
        const text = content.slice(lastIndex, startIndex);
        if (text.trim()) {
          parts.push({ type: 'text', value: text });
        }
      }

      parts.push({ type: 'code', language: 'sql', value: code.trim(), index: codeIndex }); // Hardcode language to 'sql'

      lastIndex = endIndex;
      codeIndex++;
    }

    if (lastIndex < content.length) {
      const text = content.slice(lastIndex);
      if (text.trim()) {
        parts.push({ type: 'text', value: text });
      }
    }

    if (parts.length === 0) {
      console.log('No code blocks found, rendering as text:', content);
      return <p>{content || 'No response available.'}</p>;
    }

    console.log('Rendered parts:', parts); // Debug: Log parts

    return parts.map((part, partIndex) => (
      <React.Fragment key={partIndex}>
        {part.type === 'text' ? (
          <p>{part.value}</p>
        ) : (
          <div className="db-query-container">
            <pre className="db-query">
              <span className="language-label">{part.language}</span>
              <code>{part.value}</code>
            </pre>
            <button
              className="copy-button"
              onClick={() => handleCopy(part.value, part.index)}
              title="Copy code"
            >
              {copiedIndex === part.index ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="search-page">
      <div className="search-content">
        {loading && <p className="status-message">Loading...</p>}
        {queryHistory.length > 0 ? (
          queryHistory.map((entry, index) => {
            const assistantMessages = entry.results.filter(msg => msg.role === 'assistant');
            const latestAssistantMessage = assistantMessages[assistantMessages.length - 1];

            return (
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
                      {entry.results[0]?.error ? (
                        <p className="error">{entry.results[0].error}</p>
                      ) : (
                        renderContent(latestAssistantMessage?.content || 'No response available.')
                      )}
                    </div>
                  </div>
                </div>
                {index < queryHistory.length - 1 && <hr className="separator" />}
              </React.Fragment>
            );
          })
        ) : !loading && (
          <p className="status-message">Enter a query to see results!</p>
        )}
      </div>
    </div>
  );
};

export default Search;