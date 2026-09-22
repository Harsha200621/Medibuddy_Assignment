import React from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ drug }) {
  const navigate = useNavigate();
  const info = drug.openfda || {};

  const brand = info.brand_name ? info.brand_name[0] : 'Unknown Brand';
  const generic = info.generic_name ? info.generic_name[0] : 'N/A';
  const manufacturer = info.manufacturer_name ? info.manufacturer_name[0] : 'Unknown Manufacturer';
  const route = info.route ? info.route.join(', ') : 'Not specified';
  const productType = info.product_type ? info.product_type[0] : '';

  const handleClick = () => {
    // Pass drug in location state so detail page doesn't need immediate refetch
    navigate(`/drug/${drug.id}`, { state: { drug } });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '18px', color: '#1f2937' }}>{brand}</h3>
        {productType && (
          <span style={{ fontSize: '12px', background: '#e5e7eb', padding: '2px 8px', borderRadius: '4px', height: 'fit-content' }}>
            {productType}
          </span>
        )}
      </div>
      <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>
        <strong>Generic:</strong> {generic}
      </p>
      <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>
        <strong>Manufacturer:</strong> {manufacturer}
      </p>
      <p style={{ fontSize: '13px', color: '#6b7280' }}>
        <strong>Route:</strong> {route}
      </p>
    </div>
  );
}

export default React.memo(Card);
