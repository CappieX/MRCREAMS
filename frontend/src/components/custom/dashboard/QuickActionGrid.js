import React from 'react';
import { BrandButton } from '../Button';
import { BRAND_COLORS } from '../../../assets/brand';

const QuickActionGrid = ({ actions }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12
      }}
    >
      {actions.map((action) => (
        <div
          key={action.label}
          style={{
            borderRadius: 16,
            border: '1px solid rgba(148,163,184,0.35)',
            background:
              'radial-gradient(circle at 0 0, rgba(0,180,216,0.08), transparent 55%), #ffffff',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 8px 18px rgba(15,23,42,0.04)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                backgroundColor: 'rgba(0,180,216,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: BRAND_COLORS.teal,
                fontSize: 13,
                fontWeight: 600
              }}
            >
              {action.short || action.label.charAt(0)}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a'
              }}
            >
              {action.label}
            </div>
          </div>
          {action.description && (
            <div
              style={{
                fontSize: 11,
                color: 'rgba(100,116,139,0.95)'
              }}
            >
              {action.description}
            </div>
          )}
          <BrandButton
            size="sm"
            variant="outline"
            onClick={action.onClick}
            style={{
              marginTop: 'auto',
              fontSize: 11,
              paddingBlock: 5
            }}
          >
            {action.cta || 'Open'}
          </BrandButton>
        </div>
      ))}
    </div>
  );
};

export default QuickActionGrid;

