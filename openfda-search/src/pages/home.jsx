import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import { searchDrugs } from '../api';

const QUICK_TAGS = ['Advil', 'Tylenol', 'Amoxicillin', 'Lipitor', 'Metformin'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
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
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error connecting to openFDA');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div className="app-wrapper">
      {/* Brand Header */}
      <header className="app-header">
        <div className="logo-badge">
          <div className="logo-dot"></div>
          RxRegistry
        </div>
        <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
          openFDA Endpoint
        </span>
      </header>

      {/* Hero Search Section */}
      <div className="search-container">
        <input
          type="text"
          className="search-input-field"
          placeholder="Search by brand name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="quick-tags">
          <span>Popular searches:</span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className="pill-tag"
              onClick={() => setQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#0d9488', fontSize: '14px', fontWeight: '500' }}>
          Querying openFDA label records...
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#991b1b', fontSize: '14px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Initial Empty State */}
      {!loading && !error && !debouncedQuery.trim() && (
        <div style={{ textAlign: 'center', padding: '60px 16px', color: '#94a3b8' }}>
          <p style={{ fontSize: '15px' }}>Type a brand name or select a popular formulation tag above.</p>
        </div>
      )}

      {/* Zero Match State */}
      {!loading && !error && debouncedQuery.trim() && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 16px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>No label records found for "{debouncedQuery}"</p>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Verify spelling or try searching another commercial drug brand.</p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
              {results.length} Formulations Returned
            </span>
          </div>
          <div className="results-grid">
            {results.map((item, index) => (
              <Card key={item.id || index} drug={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
