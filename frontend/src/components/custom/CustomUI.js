import React, { useState } from 'react';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../../assets/brand';
import logo from '../../assets/logo.svg';

const { deepBlue, teal, coral } = BRAND_COLORS;

const cardBase = {
  background: '#ffffff',
  borderRadius: BRAND_RADII.lg,
  boxShadow: BRAND_SHADOWS.subtle,
  padding: BRAND_SPACING.lg,
  border: '1px solid rgba(10,37,64,0.08)'
};

export const EmotionSelectorGrid = ({ emotions, value, onChange }) => {
  const items = emotions || [
    { id: 'joy', label: 'Joy' },
    { id: 'calm', label: 'Calm' },
    { id: 'anxious', label: 'Anxious' },
    { id: 'sadness', label: 'Sadness' }
  ];

  return (
    <div
      style={{
        ...cardBase,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
        gap: BRAND_SPACING.sm
      }}
    >
      {items.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange && onChange(item.id)}
            style={{
              borderRadius: BRAND_RADII.md,
              padding: '10px 12px',
              border: selected ? `2px solid ${teal}` : '1px solid rgba(10,37,64,0.18)',
              background: selected ? 'rgba(0,180,216,0.08)' : '#ffffff',
              color: deepBlue,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: selected ? 600 : 500
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export const ProgressCard = ({ title, value, subtitle }) => (
  <div style={cardBase}>
    <div style={{ fontSize: 13, textTransform: 'uppercase', color: 'rgba(10,37,64,0.6)' }}>
      {title}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: deepBlue, marginTop: 8 }}>{value}</div>
    {subtitle && (
      <div style={{ fontSize: 13, color: 'rgba(10,37,64,0.7)', marginTop: 4 }}>{subtitle}</div>
    )}
    <div
      style={{
        marginTop: 16,
        height: 6,
        borderRadius: BRAND_RADII.pill,
        background: 'rgba(10,37,64,0.06)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          height: '100%',
          width: '60%',
          background: `linear-gradient(90deg, ${teal}, ${coral})`
        }}
      />
    </div>
  </div>
);

export const StatsWidget = ({ stats }) => {
  const items =
    stats ||
    [
      { label: 'Harmony score', value: '78', suffix: '/100' },
      { label: 'Calm days', value: '12', suffix: '/14' },
      { label: 'Check-ins', value: '6', suffix: ' this week' }
    ];
  return (
    <div
      style={{
        ...cardBase,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: BRAND_SPACING.md
      }}
    >
      {items.map((item) => (
        <div key={item.label}>
          <div style={{ fontSize: 12, color: 'rgba(10,37,64,0.6)' }}>{item.label}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: deepBlue }}>
            {item.value}
            {item.suffix && (
              <span style={{ fontSize: 12, marginLeft: 4, color: 'rgba(10,37,64,0.7)' }}>
                {item.suffix}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const NavigationSidebar = ({ items, activeId, onSelect }) => {
  const links =
    items ||
    [
      { id: 'overview', label: 'Overview' },
      { id: 'emotions', label: 'Emotion Insights' },
      { id: 'sessions', label: 'Sessions' }
    ];

  return (
    <nav
      style={{
        width: 220,
        background: deepBlue,
        borderRadius: BRAND_RADII.lg,
        padding: BRAND_SPACING.md,
        color: '#ffffff'
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: BRAND_SPACING.md }}>MR.CREAMS</div>
      {links.map((link) => {
        const active = activeId === link.id;
        return (
          <button
            key={link.id}
            type="button"
            onClick={() => onSelect && onSelect(link.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: '#ffffff',
              borderRadius: BRAND_RADII.md,
              padding: '8px 10px',
              marginBottom: 4,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: active ? 600 : 500
            }}
          >
            {link.label}
          </button>
        );
      })}
    </nav>
  );
};

export const FormInput = ({ label, hint, error, ...inputProps }) => (
  <label style={{ display: 'block' }}>
    {label && (
      <div style={{ fontSize: 13, marginBottom: 4, color: 'rgba(10,37,64,0.8)' }}>{label}</div>
    )}
    <input
      {...inputProps}
      style={{
        width: '100%',
        borderRadius: BRAND_RADII.md,
        border: error ? `1px solid ${coral}` : '1px solid rgba(10,37,64,0.25)',
        padding: '10px 12px',
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box'
      }}
    />
    {hint && !error && (
      <div style={{ fontSize: 11, marginTop: 4, color: 'rgba(10,37,64,0.6)' }}>{hint}</div>
    )}
    {error && (
      <div style={{ fontSize: 11, marginTop: 4, color: coral }}>{error}</div>
    )}
  </label>
);

export const ModalOverlay = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,37,64,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: BRAND_RADII.lg,
          boxShadow: BRAND_SHADOWS.soft,
          padding: BRAND_SPACING.lg,
          width: '90%',
          maxWidth: 420
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BRAND_SPACING.md
          }}
        >
          <div style={{ fontWeight: 700, color: deepBlue }}>{title}</div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 18,
                color: 'rgba(10,37,64,0.7)'
              }}
            >
              ×
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export const LoadingState = ({ label }) => (
  <div
    style={{
      ...cardBase,
      display: 'flex',
      alignItems: 'center',
      gap: BRAND_SPACING.sm,
      justifyContent: 'center'
    }}
  >
    <div style={{ display: 'flex', gap: 6 }}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: index === 1 ? teal : 'rgba(10,37,64,0.25)'
          }}
        />
      ))}
    </div>
    <div style={{ fontSize: 13, color: 'rgba(10,37,64,0.8)' }}>
      {label || 'Preparing your harmony insights'}
    </div>
  </div>
);

export const NotificationBanner = ({ tone = 'teal', title, message }) => {
  const background =
    tone === 'coral'
      ? 'rgba(255,107,107,0.12)'
      : tone === 'blue'
      ? 'rgba(10,37,64,0.08)'
      : 'rgba(0,180,216,0.10)';
  const accent = tone === 'coral' ? coral : tone === 'blue' ? deepBlue : teal;

  return (
    <div
      style={{
        borderRadius: BRAND_RADII.md,
        padding: BRAND_SPACING.sm,
        background,
        border: `1px solid ${accent}`,
        display: 'flex',
        gap: BRAND_SPACING.sm
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          background: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 12
        }}
      >
        !
      </div>
      <div>
        {title && (
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(10,37,64,0.9)' }}>
            {title}
          </div>
        )}
        {message && (
          <div style={{ fontSize: 12, color: 'rgba(10,37,64,0.8)' }}>{message}</div>
        )}
      </div>
    </div>
  );
};

export const NotificationSystemDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: BRAND_SPACING.sm }}>
      <NotificationBanner
        tone="teal"
        title="Harmony tip"
        message="Schedule a 5-minute check-in before your next difficult conversation."
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          alignSelf: 'flex-start',
          borderRadius: BRAND_RADII.pill,
          border: 'none',
          padding: '8px 14px',
          background: teal,
          color: '#ffffff',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600
        }}
      >
        Show modal
      </button>
      <ModalOverlay
        open={open}
        title="Conflict de-escalation"
        onClose={() => setOpen(false)}
      >
        <p style={{ fontSize: 14, color: 'rgba(10,37,64,0.8)', marginBottom: 12 }}>
          Pause for one breath before you answer. Then answer only the question you heard,
          not the story in your head.
        </p>
      </ModalOverlay>
    </div>
  );
};

export const AuthPageShell = ({ title, subtitle, children, footer }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background:
        'radial-gradient(circle at top, rgba(0,180,216,0.12), transparent 60%), radial-gradient(circle at bottom, rgba(255,107,107,0.06), transparent 60%), #f1f5f9'
    }}
  >
    <header
      style={{
        padding: '16px 20px'
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: BRAND_SPACING.sm
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: BRAND_RADII.lg,
              background: 'rgba(0,180,216,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={logo}
              alt="Enum Technology"
              style={{ width: 22, height: 22 }}
            />
          </div>
          <div
            style={{
              lineHeight: 1.1
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 0.01,
                color: BRAND_COLORS.deepBlue
              }}
            >
              MR.CREAMS
            </div>
            <div
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: 0.16,
                color: 'rgba(15,23,42,0.6)'
              }}
            >
              Enum Technology
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: 'rgba(15,23,42,0.6)'
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: '#22c55e'
            }}
          />
          <span>Secure relationship environment</span>
        </div>
      </div>
    </header>
    <main
      role="main"
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#ffffff',
          borderRadius: BRAND_RADII.lg,
          boxShadow: BRAND_SHADOWS.subtle,
          border: '1px solid rgba(15,23,42,0.06)',
          padding: BRAND_SPACING.lg
        }}
      >
        <div
          style={{
            marginBottom: BRAND_SPACING.md
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: BRAND_COLORS.deepBlue,
              marginBottom: 4
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 13,
                color: 'rgba(15,23,42,0.65)'
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div>{children}</div>
        {footer && (
          <div
            style={{
              marginTop: BRAND_SPACING.md,
              fontSize: 12,
              color: 'rgba(15,23,42,0.7)'
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </main>
  </div>
);

const CustomUI = {
  EmotionSelectorGrid,
  ProgressCard,
  StatsWidget,
  NavigationSidebar,
  FormInput,
  ModalOverlay,
  LoadingState,
  NotificationBanner,
  NotificationSystemDemo,
  AuthPageShell
};

export default CustomUI;
