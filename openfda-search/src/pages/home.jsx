import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import { searchDrugs } from '../api';

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
          setError(err.message || 'Error connecting to FDA database');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div className="container">
      {/* Header */}
      <header style={{ marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
          OpenFDA Label Explorer
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
          Medicine Database
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>
          Instant search for FDA-registered formulations, dosages, and warnings
        </p>
      </header>

      {/* Search Bar */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search by brand name (e.g. Advil, Tylenol, Aspirin)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b' }}>
          <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.6s linear infinite', marginBottom: '8px' }} />
          <p style={{ fontSize: '14px' }}>Searching FDA database...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '14px', marginBottom: '16px' }}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Empty Search Prompt */}
      {!loading && !error && !debouncedQuery.trim() && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
          <p style={{ fontSize: '15px' }}>Start typing a medicine brand name above to view details.</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && debouncedQuery.trim() && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            No medicines found matching "{debouncedQuery}"
          </p>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
            Try searching for well-known brand names like <em>Advil</em>, <em>Lipitor</em>, or <em>Amoxicillin</em>.
          </p>
        </div>
      )}

      {/* Results List */}
      {!loading && results.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '500' }}>
            Showing {results.length} FDA label record{results.length > 1 ? 's' : ''}
          </p>
          {results.map((item, index) => (
            <Card key={item.id || index} drug={item} />
          ))}
        </div>
      )}
    </div>
  );
}
