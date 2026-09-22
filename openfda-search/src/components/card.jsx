import React from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ drug }) {
  const navigate = useNavigate();
  const info = drug.openfda || {};

  const brand = info.brand_name ? info.brand_name[0] : 'Unnamed Formulation';
  const generic = info.generic_name ? info.generic_name[0] : 'Active ingredients not listed';
  const manufacturer = info.manufacturer_name ? info.manufacturer_name[0] : 'Manufacturer unspecified';
  const route = info.route ? info.route.join(', ') : 'Not specified';
  const productType = info.product_type ? info.product_type[0] : 'FDA Listed';

  return (
    <div className="med-card" onClick={() => navigate(`/drug/${drug.id}`, { state: { drug } })}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
          <span className="category-pill">{productType}</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {drug.id ? drug.id.slice(0, 8) : 'N/A'}</span>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>
          {brand}
        </h3>

        <p style={{ fontSize: '13px', color: '#0f766e', fontWeight: '500', marginBottom: '12px' }}>
          {generic}
        </p>

        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p><strong>Mfg:</strong> {manufacturer}</p>
          <p><strong>Route:</strong> {route}</p>
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Full drug sheet</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0d9488' }}>Details &rarr;</span>
      </div>
    </div>
  );
}

export default React.memo(Card);
