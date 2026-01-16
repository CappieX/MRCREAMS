import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_COLORS } from '../../../assets/brand';

const arrowIcon = (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M6 3l4 5-4 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BreadcrumbNav = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'rgba(148,163,184,0.95)'
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const content = (
          <span
            style={{
              fontWeight: isLast ? 600 : 500,
              color: isLast ? BRAND_COLORS.deepBlue : 'rgba(148,163,184,0.95)'
            }}
          >
            {item.label}
          </span>
        );

        return (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(148,163,184,0.9)'
                }}
              >
                {arrowIcon}
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                {content}
              </Link>
            ) : (
              content
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default BreadcrumbNav;

