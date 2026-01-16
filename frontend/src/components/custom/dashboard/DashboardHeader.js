import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { BRAND_COLORS } from '../../../assets/brand';

const circleSvg = (filled) => (
  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
    <circle
      cx="10"
      cy="10"
      r="7"
      fill={filled ? BRAND_COLORS.teal : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.4"
    />
  </svg>
);

const bellSvg = (active) => (
  <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M10 3a4 4 0 0 0-4 4v2.7c0 .43-.18.84-.5 1.13L4.4 11.7C3.7 12.3 4.1 13.4 5 13.4h10c.9 0 1.3-1.1.6-1.7l-1.1-.87c-.32-.29-.5-.7-.5-1.13V7a4 4 0 0 0-4-4z"
      fill={active ? BRAND_COLORS.teal : 'none'}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 15.5c.4.9 1.3 1.5 2.5 1.5s2.1-.6 2.5-1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const searchIcon = (
  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
    <circle
      cx="9"
      cy="9"
      r="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <line
      x1="12.5"
      y1="12.5"
      x2="17"
      y2="17"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const DashboardHeader = ({ title, subtitle, onToggleSidebar, breadcrumb }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('light');
  const [search, setSearch] = useState('');

  const initials = useMemo(() => {
    if (!user || !user.name) return 'ET';
    const parts = String(user.name).trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleModeToggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (next === 'dark') {
        root.classList.add('dashboard-dark');
      } else {
        root.classList.remove('dashboard-dark');
      }
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backgroundColor: 'rgba(248,249,250,0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(148,163,184,0.35)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingInline: 20,
          paddingBlock: 10,
          gap: 16
        }}
      >
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          style={{
            border: 'none',
            backgroundColor: '#ffffff',
            borderRadius: 999,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(15,23,42,0.18)',
            cursor: 'pointer'
          }}
        >
          <span
            style={{
              display: 'block',
              width: 14,
              height: 2,
              borderRadius: 999,
              backgroundColor: '#0F172A',
              boxShadow: '0 5px 0 #0F172A, 0 -5px 0 #0F172A'
            }}
          />
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 0,
            flex: 1
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 0
            }}
          >
            <h1
              style={{
                fontFamily:
                  '"Poppins", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 0.01,
                color: BRAND_COLORS.deepBlue,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <span
                style={{
                  fontSize: 12,
                  color: 'rgba(15,23,42,0.65)'
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
          {breadcrumb}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 10,
                color: 'rgba(148,163,184,0.9)'
              }}
            >
              {searchIcon}
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people, sessions, reports"
              style={{
                width: 240,
                maxWidth: '40vw',
                paddingInline: 30,
                paddingBlock: 7,
                borderRadius: 999,
                border: '1px solid rgba(148,163,184,0.6)',
                fontSize: 12,
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleModeToggle}
            aria-label="Toggle dark mode"
            style={{
              width: 36,
              height: 24,
              borderRadius: 999,
              border: '1px solid rgba(148,163,184,0.7)',
              backgroundColor: mode === 'dark' ? '#0F172A' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              paddingInline: 3,
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor: mode === 'dark' ? '#020617' : '#e5e7eb',
                color: mode === 'dark' ? '#f97316' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: mode === 'dark' ? 'translateX(12px)' : 'translateX(0)',
                transition: 'transform 160ms ease-out'
              }}
            >
              {mode === 'dark' ? circleSvg(true) : circleSvg(false)}
            </div>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            style={{
              position: 'relative',
              width: 32,
              height: 32,
              borderRadius: 999,
              border: 'none',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(15,23,42,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {bellSvg(true)}
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: BRAND_COLORS.coral,
                color: '#ffffff',
                fontSize: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              3
            </span>
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: BRAND_COLORS.deepBlue
                }}
              >
                {user?.name || 'Enum Operator'}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: 'rgba(148,163,184,0.95)'
                }}
              >
                {user?.userType || 'professional'}
              </span>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                background:
                  'radial-gradient(circle at 0 0, rgba(0,180,216,0.25), transparent 60%), radial-gradient(circle at 100% 100%, rgba(255,107,107,0.3), transparent 55%), #0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 600
              }}
            >
              {initials}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(148,163,184,0.95)',
                paddingInline: 6,
                paddingBlock: 4,
                borderRadius: 999,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
