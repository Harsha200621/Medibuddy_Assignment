import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDrugById } from '../api';

// Helper to format unstructured FDA warning text into concise bullet points
function formatTextToBullets(rawText) {
  if (!rawText) return ['No explicit precautions recorded on label.'];

  // 1. Remove repetitive uppercase headers like "WARNINGS:" or "DO NOT USE IF"
  const cleaned = rawText
    .replace(/^(WARNINGS|WARNING|PRECAUTIONS|CAUTIONS|ATTENTION|ALERT):?/i, '')
    .trim();

  // 2. Split on common FDA delimiters (bullet symbols, numbered lists, newlines, or sentence boundaries)
  const items = cleaned
    .split(/(?:\r?\n|•|;|(?<=\.)\s+(?=[A-Z0-9]))/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15); // Discard tiny fragments/empty lines

  // If parsing didn't create distinct chunks, fallback to the cleaned text as a single point
  if (items.length === 0) return [cleaned];

  // Return the most important lines (cap at 6 to avoid overwhelming the user)
  return items.slice(0, 6);
}

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [drug, setDrug] = useState(location.state?.drug || null);
  const [loading, setLoading] = useState(!drug);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (drug) return;

    const controller = new AbortController();
    setLoading(true);

    getDrugById(id, controller.signal)
      .then((data) => {
        if (!data) {
          setError('Medicine record not found');
        } else {
          setDrug(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load details');
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, drug]);

  if (loading) {
    return (
      <div className="app-wrapper" style={{ textAlign: 'center', padding: '60px 0', color: '#0d9488' }}>
        Retrieving clinical record...
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="app-wrapper">
        <button className="back-link" onClick={() => navigate('/')}>
          &larr; Back to registry
        </button>
        <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '10px' }}>
          {error || 'Medicine details unavailable.'}
        </div>
      </div>
    );
  }

  const info = drug.openfda || {};
  const brand = info.brand_name ? info.brand_name[0] : 'Unnamed Formulation';
  const generic = info.generic_name ? info.generic_name[0] : 'Active ingredients not listed';
  const manufacturer = info.manufacturer_name ? info.manufacturer_name[0] : 'Not specified';
  const route = info.route ? info.route.join(', ') : 'Not specified';
  const substance = info.substance_name ? info.substance_name.join(', ') : 'Not specified';
  const productType = info.product_type ? info.product_type[0] : 'OTC / Prescription';

  const rawIndications = drug.indications_and_usage ? drug.indications_and_usage[0] : '';
  const rawWarnings = drug.warnings ? drug.warnings[0] : drug.warnings_and_cautions ? drug.warnings_and_cautions[0] : '';

  const indicationBullets = formatTextToBullets(rawIndications);
  const warningBullets = formatTextToBullets(rawWarnings);

  return (
    <div className="app-wrapper">
      <button className="back-link" onClick={() => navigate(-1)}>
        &larr; Back to search results
      </button>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
          <span className="category-pill" style={{ background: '#ccfbf1', color: '#0f766e', marginBottom: '10px', display: 'inline-block' }}>
            {productType}
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{brand}</h1>
          <p style={{ fontSize: '14px', color: '#0d9488', fontWeight: '500', marginTop: '2px' }}>{generic}</p>
        </div>

        {/* Quick Facts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Manufacturer</span>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginTop: '2px' }}>{manufacturer}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Route</span>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginTop: '2px' }}>{route}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Active Substance</span>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginTop: '2px' }}>{substance}</p>
          </div>
        </div>

        {/* Indications Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
            Indications & Uses
          </h3>
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <ul style={{ paddingLeft: '18px', color: '#334155', fontSize: '13.5px', lineHeight: '1.7' }}>
              {indicationBullets.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warnings & Precautions Section */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#b91c1c', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚠️</span> Important Warnings & Safety Precautions
          </h3>
          <div style={{ background: '#fffbeb', padding: '16px 20px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
            <ul style={{ paddingLeft: '18px', color: '#78350f', fontSize: '13.5px', lineHeight: '1.7' }}>
              {warningBullets.map((point, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
