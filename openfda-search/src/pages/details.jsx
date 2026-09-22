import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDrugById } from '../api';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [drug, setDrug] = useState(location.state?.drug || null);
  const [loading, setLoading] = useState(!drug);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have drug from router state, do not fetch
    if (drug) return;

    const controller = new AbortController();
    setLoading(true);

    getDrugById(id, controller.signal)
      .then((data) => {
        if (!data) {
          setError('Medicine not found');
        } else {
          setDrug(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch details');
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, drug]);

  if (loading) return <div className="container"><p>Loading details...</p></div>;

  if (error || !drug) {
    return (
      <div className="container">
        <button onClick={() => navigate('/')} style={{ marginBottom: '16px', cursor: 'pointer' }}>
          ← Back to search
        </button>
        <p style={{ color: 'red' }}>{error || 'Not found'}</p>
      </div>
    );
  }

  const info = drug.openfda || {};
  const brand = info.brand_name ? info.brand_name[0] : 'Unknown Brand';
  const generic = info.generic_name ? info.generic_name[0] : 'N/A';
  const manufacturer = info.manufacturer_name ? info.manufacturer_name[0] : 'N/A';
  const route = info.route ? info.route.join(', ') : 'N/A';
  const substance = info.substance_name ? info.substance_name.join(', ') : 'N/A';

  // Read common fields that might exist in drug label
  const indications = drug.indications_and_usage ? drug.indications_and_usage[0] : 'No indications provided.';
  const warnings = drug.warnings ? drug.warnings[0] : drug.warnings_and_cautions ? drug.warnings_and_cautions[0] : 'No warnings listed.';

  return (
    <div className="container">
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#2563eb',
          cursor: 'pointer',
          fontSize: '15px',
          marginBottom: '16px',
        }}
      >
        ← Back
      </button>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>{brand}</h1>
        <p style={{ color: '#4b5563', marginBottom: '16px' }}><strong>Generic:</strong> {generic}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <strong>Manufacturer:</strong>
            <p style={{ color: '#4b5563' }}>{manufacturer}</p>
          </div>
          <div>
            <strong>Route:</strong>
            <p style={{ color: '#4b5563' }}>{route}</p>
          </div>
          <div>
            <strong>Active Substance:</strong>
            <p style={{ color: '#4b5563' }}>{substance}</p>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>Indications & Usage</h3>
          <p style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap' }}>{indications}</p>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>Warnings</h3>
          <p style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap' }}>{warnings}</p>
        </div>
      </div>
    </div>
  );
}
