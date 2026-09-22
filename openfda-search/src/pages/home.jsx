import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { searchDrugs } from '../api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce logic: wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchDrugs(debouncedQuery, controller.signal)
      .then((data) => {
        if (data !== null) {
          setResults(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div className="container">
      <h1 style={{ marginBottom: '16px', fontSize: '24px' }}>FDA Medicine Search</h1>
      
      <input
        type="text"
        placeholder="Search by brand name (e.g. Advil, Tylenol)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      />

      {loading && <p style={{ color: '#6b7280' }}>Loading results...</p>}

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {!loading && !error && debouncedQuery.trim() && results.length === 0 && (
        <p style={{ color: '#6b7280' }}>No results found for "{debouncedQuery}".</p>
      )}

      {!loading && results.length > 0 && (
        <div>
          {results.map((item, index) => (
            <Card key={item.id || index} drug={item} />
          ))}
        </div>
      )}
    </div>
  );
}
