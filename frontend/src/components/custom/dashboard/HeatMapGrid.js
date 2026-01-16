import React from 'react';
import { BRAND_COLORS } from '../../../assets/brand';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const weeks = 10;

const HeatMapGrid = () => {
  const cells = [];
  for (let w = 0; w < weeks; w += 1) {
    for (let d = 0; d < days.length; d += 1) {
      const intensity = (w * days.length + d) % 5;
      cells.push({ week: w, day: d, value: intensity });
    }
  }

  const colorFor = (value) => {
    if (value === 0) return 'rgba(148,163,184,0.15)';
    if (value === 1) return 'rgba(0,180,216,0.18)';
    if (value === 2) return 'rgba(0,180,216,0.35)';
    if (value === 3) return 'rgba(0,180,216,0.55)';
    return BRAND_COLORS.teal;
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `16px repeat(${weeks}, 14px)`,
        gap: 4,
        alignItems: 'center'
      }}
    >
      {days.map((day) => (
        <div
          key={day}
          style={{
            fontSize: 9,
            color: 'rgba(148,163,184,0.95)'
          }}
        >
          {day}
        </div>
      ))}
      {cells.map((cell) => (
        <div
          key={`${cell.week}-${cell.day}`}
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            backgroundColor: colorFor(cell.value)
          }}
        />
      ))}
    </div>
  );
};

export default HeatMapGrid;

