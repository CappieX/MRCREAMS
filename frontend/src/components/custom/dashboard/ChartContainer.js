import React from 'react';
import { BrandCard } from '../Card';

const ChartContainer = ({ title, meta, children }) => {
  return (
    <BrandCard
      tone="surface"
      header={
        title
          ? {
              title,
              meta
            }
          : undefined
      }
      style={{
        padding: 18,
        minHeight: 220
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </BrandCard>
  );
};

export default ChartContainer;

