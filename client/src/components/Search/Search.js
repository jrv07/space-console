import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCopy, FaCheck } from 'react-icons/fa';
import TableVisualization from '../Visualization/TableVisualization';
import './Search.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';

const formatCode = (code, language) => {
  try {
    
    let parser;
    let plugins = [];

    switch (language) {
      case 'js':
      case 'javascript':
      case 'jsx':
      case 'json':
        parser = 'babel';
        plugins = [parserBabel];
        break;
      case 'html':
        parser = 'html';
        plugins = [parserHtml];
        break;
      default:
        return code;
    }

    return prettier.format(code, {
      parser,
      plugins,
    });
  } catch (err) {
    console.warn(`Formatting failed for ${language}`, err);
    return code;
  }
};

const Search = () => {
  const { queryHistory, loading } = useSelector((state) => state.data);
  const latestRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    console.log('Search.js: loading state:', loading, 'queryHistory length:', queryHistory.length); // Debug: Log state
    if (latestRef.current) {
      latestRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queryHistory, loading]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };
  const formatMarkdown = (content) => {
    return content
    // Ensure headers like ### start on a new line
    .replace(/(?!\n)\s*###/g, '\n\n###')
    // Ensure list items start on a new line
    .replace(/(?!\n)\s*\d+\.\s/g, '\n$&') // Adding a new line before ordered list
    .replace(/(?!\n)\s*-\s/g, '\n- ')    // Adding a new line before unordered list
    // Ensure that there's a space before code blocks (for code block recognition)
    .replace(/(?<=\n)```/g, '\n```') 
    // Normalize multiple line breaks to two for consistency
    .replace(/\n{2,}/g, '\n\n')
    .trim();
  };
  
  const renderContent = (content, handleCopy, copiedIndex) => {
    if (!content) return <p>No response available.</p>;
  
    console.log('renderContent input:', content);
  
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)\s*```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let codeIndex = 0;
  
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [fullMatch, lang, code] = match;
      const startIndex = match.index;
      const endIndex = codeBlockRegex.lastIndex;
  
      if (startIndex > lastIndex) {
        const text = content.slice(lastIndex, startIndex);
        if (text.trim()) {
          parts.push({ type: 'text', value: text });
        }
      }
  
      // Format SQL code before pushing it to the parts array
      const formattedCode = formatCode(code.trim(), lang || 'sql');
  
      // Push the formatted code block
      parts.push({
        type: 'code',
        language: lang || 'sql',
        value: formattedCode,
        index: codeIndex,
      });
  
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
      return (
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {formatMarkdown(content)}
          </ReactMarkdown>
        </div>
      );
    }
  
    return parts.map((part, partIndex) => (
      <React.Fragment key={partIndex}>
        {part.type === 'text' ? (
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {formatMarkdown(part.value)}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="db-query-container my-4">
            <pre className="db-query relative bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
              <span className="language-label absolute top-1 left-2 text-sm text-gray-400">
                {part.language}
              </span>
              <code>{part.value}</code>
            </pre>
            <button
              className="copy-button mt-1 ml-2 text-sm text-blue-600 hover:text-blue-800"
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
                        <>
                        <div className="result-table">
                          {latestAssistantMessage?.data && latestAssistantMessage.data.length > 0 && (
                            <TableVisualization data={latestAssistantMessage.data} />
                          )}
                          </div>
                          <div className="result-text">
                            {renderContent(latestAssistantMessage?.content, handleCopy, copiedIndex)}
                          </div>
                        </>
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