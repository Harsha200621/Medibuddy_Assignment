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
      <div className="container" style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
        Loading medicine details...
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to search
        </button>
        <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px' }}>
          {error || 'Medicine details unavailable.'}
        </div>
      </div>
    );
  }

  const info = drug.openfda || {};
  const brand = info.brand_name ? info.brand_name[0] : 'Unknown Brand Name';
  const generic = info.generic_name ? info.generic_name[0] : 'Not specified';
  const manufacturer = info.manufacturer_name ? info.manufacturer_name[0] : 'Not specified';
  const route = info.route ? info.route.join(', ') : 'Not specified';
  const substance = info.substance_name ? info.substance_name.join(', ') : 'Not specified';
  const productType = info.product_type ? info.product_type[0] : 'Medicine';

  const indications = drug.indications_and_usage ? drug.indications_and_usage[0] : 'No indications and usage information provided on label.';
  const warnings = drug.warnings ? drug.warnings[0] : drug.warnings_and_cautions ? drug.warnings_and_cautions[0] : 'No explicit warnings provided on label.';

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back to search results
      </button>

      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {/* Header Section */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '20px' }}>
          <span className="badge" style={{ marginBottom: '8px' }}>{productType}</span>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>{brand}</h1>
          <p style={{ fontSize: '15px', color: '#64748b' }}>
            <strong>Generic Name: </strong>{generic}
          </p>
        </div>

        {/* Quick Facts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Manufacturer</span>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginTop: '4px' }}>{manufacturer}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Administration Route</span>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginTop: '4px' }}>{route}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Active Substance</span>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginTop: '4px' }}>{substance}</p>
          </div>
        </div>

        {/* Indications Section */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Indications & Usage
          </h2>
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #f1f5f9', whiteSpace: 'pre-line' }}>
            {indications}
          </div>
        </div>

        {/* Warnings Section */}
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: '#b91c1c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Warnings & Precautions
          </h2>
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', background: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fef3c7', whiteSpace: 'pre-line' }}>
            {warnings}
          </div>
        </div>
      </div>
    </div>
  );
}
