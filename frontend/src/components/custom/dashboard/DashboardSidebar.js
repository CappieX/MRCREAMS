import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.svg';
import { BRAND_COLORS } from '../../../assets/brand';

const roles = {
  super_admin: {
    label: 'Super Admin',
    basePath: '/dashboard/super-admin',
    items: [
      { key: 'overview', label: 'Overview', path: '' },
      { key: 'users', label: 'Users', path: 'users' },
      { key: 'analytics', label: 'Analytics', path: 'analytics' },
      { key: 'models', label: 'Models', path: 'models' },
      { key: 'security', label: 'Security', path: 'security' },
      { key: 'data', label: 'Data Governance', path: 'data-governance' },
      { key: 'integrations', label: 'Integrations', path: 'integrations' },
      { key: 'settings', label: 'Settings', path: 'settings' }
    ]
  },
  platform_admin: {
    label: 'Platform Admin',
    basePath: '/dashboard/platform-admin',
    items: [
      { key: 'overview', label: 'Overview', path: '' },
      { key: 'organizations', label: 'Organizations', path: 'users' },
      { key: 'health', label: 'System Health', path: 'health' },
      { key: 'logs', label: 'Audit Logs', path: 'logs' },
      { key: 'analytics', label: 'Analytics', path: 'analytics' },
      { key: 'config', label: 'Configuration', path: 'config' },
      { key: 'notifications', label: 'Notifications', path: 'notifications' }
    ]
  },
  admin: {
    label: 'Admin',
    basePath: '/dashboard/admin',
    items: [
      { key: 'overview', label: 'Overview', path: '' },
      { key: 'team', label: 'Team', path: '' },
      { key: 'schedule', label: 'Schedule', path: '' },
      { key: 'resources', label: 'Resources', path: '' }
    ]
  },
  support: {
    label: 'Support',
    basePath: '/dashboard/support',
    items: [
      { key: 'overview', label: 'Overview', path: '' },
      { key: 'tickets', label: 'Tickets', path: 'tickets' },
      { key: 'kb', label: 'Knowledge Base', path: 'tickets' },
      { key: 'metrics', label: 'Metrics', path: '' }
    ]
  },
  therapist: {
    label: 'Therapist',
    basePath: '/dashboard/therapist',
    items: [
      { key: 'overview', label: 'Overview', path: '' },
      { key: 'clients', label: 'Clients', path: 'clients' },
      { key: 'sessions', label: 'Sessions', path: 'sessions' },
      { key: 'billing', label: 'Billing', path: '' }
    ]
  },
  executive: {
    label: 'Executive',
    basePath: '/dashboard/executive',
    items: [
      { key: 'overview', label: 'Overview', path: '' },
      { key: 'finance', label: 'Finance', path: '' },
      { key: 'growth', label: 'Growth', path: '' },
      { key: 'strategy', label: 'Strategy', path: '' }
    ]
  }
};

const iconForIndex = (index) => {
  const size = 18;
  const stroke = 'currentColor';
  if (index === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M3 9.5L10 3l7 6.5v7.5h-4.5v-4h-5v4H3z"
          fill="none"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke={stroke} strokeWidth="1.4" fill="none" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" stroke={stroke} strokeWidth="1.4" fill="none" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" stroke={stroke} strokeWidth="1.4" fill="none" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke={stroke} strokeWidth="1.4" fill="none" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M4 14l4-8 3 5 3.5-7"
          fill="none"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="14" r="1.2" fill={stroke} />
        <circle cx="8" cy="6" r="1.2" fill={stroke} />
        <circle cx="11" cy="11" r="1.2" fill={stroke} />
        <circle cx="14.5" cy="4" r="1.2" fill={stroke} />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <rect x="3" y="4" width="14" height="3" rx="1.5" fill={stroke} />
        <rect x="3" y="9" width="10" height="3" rx="1.5" fill={stroke} />
        <rect x="3" y="14" width="7" height="3" rx="1.5" fill={stroke} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="6" r="3" fill="none" stroke={stroke} strokeWidth="1.4" />
      <path
        d="M4 16.5c1.4-2 3.3-3 6-3s4.6 1 6 3"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
};

const DashboardSidebar = ({ role, open, onToggle }) => {
  const location = useLocation();
  const config = roles[role] || roles.super_admin;
  const base = config.basePath;

  const isActive = (path) => {
    const full = path ? `${base}/${path}` : base;
    return location.pathname === full || location.pathname.startsWith(`${full}/`);
  };

  const width = open ? 260 : 80;

  return (
    <aside
      style={{
        width,
        backgroundColor: BRAND_COLORS.deepBlue,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        paddingInline: 12,
        paddingBlock: 16,
        boxShadow: '2px 0 18px rgba(15,23,42,0.45)',
        position: 'relative',
        transition: 'width 180ms cubic-bezier(0.21, 0.79, 0.26, 0.99)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingInline: 4,
          marginBottom: 24
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: 'rgba(0,180,216,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={logo}
            alt="Enum Technology"
            style={{ width: 18, height: 18 }}
          />
        </div>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 0.06,
                textTransform: 'uppercase'
              }}
            >
              Enum Technology
            </span>
            <span
              style={{
                fontSize: 11,
                opacity: 0.7
              }}
            >
              {config.label}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
          style={{
            marginLeft: 'auto',
            width: 28,
            height: 28,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.3)',
            backgroundColor: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          {open ? '←' : '→'}
        </button>
      </div>

      <nav
        aria-label="Primary"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flex: 1
        }}
      >
        {config.items.map((item, index) => {
          const full = item.path ? `${config.basePath}/${item.path}` : config.basePath;
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.key}
              to={full}
              style={{
                textDecoration: 'none'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingInline: 10,
                  paddingBlock: 8,
                  borderRadius: 999,
                  backgroundColor: active ? 'rgba(0,180,216,0.16)' : 'transparent',
                  color: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 160ms ease-out, transform 160ms ease-out',
                  transform: active ? 'translateX(2px)' : 'none'
                }}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: 3,
                      top: 6,
                      bottom: 6,
                      borderRadius: 999,
                      background:
                        'linear-gradient(180deg, #00B4D8, rgba(0,180,216,0.1))'
                    }}
                  />
                )}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    backgroundColor: active
                      ? 'rgba(0,180,216,0.2)'
                      : 'rgba(15,23,42,0.7)',
                    color: 'rgba(255,255,255,0.9)',
                    flexShrink: 0
                  }}
                >
                  {iconForIndex(index)}
                </span>
                {open && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 12,
          paddingInline: 6,
          paddingBlock: 6,
          borderRadius: 12,
          backgroundColor: 'rgba(15,23,42,0.85)',
          border: '1px solid rgba(148,163,184,0.35)',
          fontSize: 11,
          lineHeight: 1.3
        }}
      >
        {open ? (
          <div>
            <div
              style={{
                fontWeight: 600,
                marginBottom: 2
              }}
            >
              Platform health
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 0 4px rgba(34,197,94,0.35)'
                }}
              />
              <span>All systems operational</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: '#22c55e',
                boxShadow: '0 0 0 4px rgba(34,197,94,0.35)'
              }}
            />
            <span>OK</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;

