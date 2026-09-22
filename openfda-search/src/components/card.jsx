import React from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ drug }) {
  const navigate = useNavigate();
  const info = drug.openfda || {};

  const brand = info.brand_name ? info.brand_name[0] : 'Unknown Brand';
  const generic = info.generic_name ? info.generic_name[0] : 'Not specified';
  const manufacturer = info.manufacturer_name ? info.manufacturer_name[0] : 'Not specified';
  const route = info.route ? info.route.join(', ') : 'Not specified';
  const productType = info.product_type ? info.product_type[0] : 'Prescription / OTC';

  const handleClick = () => {
    navigate(`/drug/${drug.id}`, { state: { drug } });
  };

  return (
    <div className="drug-card" onClick={handleClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', lineHeight: 1.3 }}>
          {brand}
        </h3>
        <span className="badge">{productType}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
        <p style={{ color: '#334155' }}>
          <span style={{ color: '#64748b', fontWeight: '500' }}>Generic: </span>
          <span style={{ fontWeight: '500' }}>{generic}</span>
        </p>
        <p style={{ color: '#334155' }}>
          <span style={{ color: '#64748b', fontWeight: '500' }}>Manufacturer: </span>
          {manufacturer}
        </p>
        <p style={{ color: '#334155' }}>
          <span style={{ color: '#64748b', fontWeight: '500' }}>Route: </span>
          <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
            {route}
          </span>
        </p>
      </div>

      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>
          View Label Details →
        </span>
      </div>
    </div>
  );
}

export default React.memo(Card);
