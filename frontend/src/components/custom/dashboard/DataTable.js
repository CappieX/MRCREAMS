import React, { useMemo, useRef, useState } from 'react';
import { BRAND_COLORS } from '../../../assets/brand';
import { BrandButton } from '../Button';

const rowHeight = 44;
const viewportHeight = 320;

const DataTable = ({ columns, rows, keyField = 'id' }) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + 4;
    const end = start + visibleCount;
    return {
      startIndex: Math.max(0, start),
      endIndex: Math.min(rows.length, end)
    };
  }, [scrollTop, rows.length]);

  const virtualRows = rows.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;
  const totalHeight = rows.length * rowHeight;

  const handleExport = () => {
    const data = rows.map((row) => {
      const entry = {};
      columns.forEach((col) => {
        entry[col.label || col.key] = row[col.key];
      });
      return entry;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dashboard-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: 'rgba(100,116,139,0.95)'
          }}
        >
          Showing {rows.length} records
        </div>
        <BrandButton
          size="sm"
          variant="outline"
          onClick={handleExport}
          style={{
            fontSize: 11,
            paddingInline: 10,
            paddingBlock: 4
          }}
        >
          Export JSON
        </BrandButton>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          borderRadius: 16,
          border: '1px solid rgba(148,163,184,0.4)',
          overflow: 'auto',
          maxHeight: viewportHeight,
          position: 'relative',
          backgroundColor: '#ffffff'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: 12
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  'linear-gradient(90deg, rgba(15,23,42,0.02), rgba(15,23,42,0.04))'
              }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: col.align || 'left',
                    paddingInline: 14,
                    paddingBlock: 10,
                    fontWeight: 600,
                    color: 'rgba(15,23,42,0.75)',
                    borderBottom: '1px solid rgba(148,163,184,0.45)',
                    position: 'sticky',
                    top: 0,
                    background:
                      'linear-gradient(90deg, rgba(248,249,250,0.92), rgba(241,245,249,0.96))',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: offsetY }}>
              <td colSpan={columns.length} />
            </tr>
            {virtualRows.map((row, index) => {
              const currentIndex = startIndex + index;
              const stripe = currentIndex % 2 === 1;
              return (
                <tr
                  key={row[keyField] || currentIndex}
                  style={{
                    backgroundColor: stripe
                      ? 'rgba(248,250,252,0.7)'
                      : '#ffffff',
                    transition: 'background-color 120ms ease-out'
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        paddingInline: 14,
                        paddingBlock: 10,
                        borderBottom: '1px solid rgba(241,245,249,0.85)',
                        fontSize: 12,
                        color: 'rgba(15,23,42,0.85)',
                        textAlign: col.align || 'left',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr style={{ height: totalHeight - offsetY - virtualRows.length * rowHeight }}>
              <td colSpan={columns.length} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;

