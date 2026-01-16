import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPageShell } from '../components/custom/CustomUI';
import { BrandButton } from '../components/custom/Button';
import { BrandText } from '../components/custom/Typography';
import { BRAND_COLORS, BRAND_SPACING, BRAND_RADII } from '../assets/brand';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = (userType) => {
    if (userType === 'client') {
      navigate('/register');
    } else if (userType === 'professional') {
      navigate('/pro-login'); // Or /login/professional if you prefer
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleProLogin = () => {
    navigate('/pro-login');
  };

  return (
    <AuthPageShell
      title="How would you like to use MR.CREAMS?"
      subtitle="Choose the option that best describes your relationship with the platform."
      footer={
        <div
          style={{
            textAlign: 'center'
          }}
        >
          <BrandText variant="caption" tone="muted">
            Already using MR.CREAMS?
          </BrandText>
          <div
            style={{
              marginTop: 6,
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            <button
              type="button"
              onClick={handleLogin}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                fontSize: 13,
                color: 'rgba(15,23,42,0.9)',
                textDecoration: 'underline'
              }}
            >
              Sign in
            </button>
            <span
              style={{
                fontSize: 13,
                color: 'rgba(148,163,184,0.9)'
              }}
            >
              •
            </span>
            <button
              type="button"
              onClick={handleProLogin}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                fontSize: 13,
                color: 'rgba(15,23,42,0.9)',
                textDecoration: 'underline'
              }}
            >
              Professional login
            </button>
          </div>
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: BRAND_SPACING.md
        }}
      >
        <BrandText variant="body" tone="muted">
          Pick what describes you today. You can still explore other roles later.
        </BrandText>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: BRAND_SPACING.sm
          }}
        >
          <button
            type="button"
            onClick={() => handleUserTypeSelection('client')}
            style={{
              width: '100%',
              textAlign: 'left',
              borderRadius: BRAND_RADII.lg,
              border: `1px solid rgba(10,37,64,0.12)`,
              padding: BRAND_SPACING.md,
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: BRAND_SPACING.sm,
              cursor: 'pointer',
              boxShadow: BRAND_COLORS.teal
                ? '0 14px 30px rgba(15,23,42,0.06)'
                : 'none'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: BRAND_SPACING.sm
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(0,180,216,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22
                }}
              >
                💞
              </div>
              <div>
                <BrandText variant="h5">
                  For my relationship
                </BrandText>
                <BrandText variant="caption" tone="muted">
                  Individuals and couples improving communication and emotional connection.
                </BrandText>
              </div>
            </div>
            <BrandText variant="body" tone="muted">
              Get guided conflict support, emotion check-ins, and shared progress dashboards for
              you and your partner.
            </BrandText>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6
              }}
            >
              {['Couples', 'Individuals', 'Dating', 'Married'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    paddingInline: 10,
                    paddingBlock: 4,
                    borderRadius: 999,
                    backgroundColor: 'rgba(0,180,216,0.08)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: BRAND_COLORS.teal
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <BrandButton
              type="button"
              style={{
                marginTop: 4,
                width: '100%'
              }}
            >
              Continue as user
            </BrandButton>
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeSelection('professional')}
            style={{
              width: '100%',
              textAlign: 'left',
              borderRadius: BRAND_RADII.lg,
              border: `1px solid rgba(76,81,191,0.28)`,
              padding: BRAND_SPACING.md,
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: BRAND_SPACING.sm,
              cursor: 'pointer',
              boxShadow: '0 14px 30px rgba(15,23,42,0.06)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: BRAND_SPACING.sm
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(139,95,191,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22
                }}
              >
                🩺
              </div>
              <div>
                <BrandText variant="h5">
                  For professional use
                </BrandText>
                <BrandText variant="caption" tone="muted">
                  Therapists, admins, support teams, executives and super admins.
                </BrandText>
              </div>
            </div>
            <BrandText variant="body" tone="muted">
              Access MR.CREAMS Pro dashboards, session analytics, governance tools and organization
              controls.
            </BrandText>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6
              }}
            >
              {['Therapists', 'Counselors', 'Admins', 'Organizations'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    paddingInline: 10,
                    paddingBlock: 4,
                    borderRadius: 999,
                    backgroundColor: 'rgba(139,95,191,0.1)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#8B5FBF'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <BrandButton
              type="button"
              variant="outline"
              style={{
                marginTop: 4,
                width: '100%'
              }}
            >
              Continue as professional
            </BrandButton>
          </button>
        </div>
        <BrandText
          variant="caption"
          tone="muted"
          style={{
            textAlign: 'center',
            marginTop: 4
          }}
        >
          🔒 Secure and private • 💝 Trusted by teams and couples • 🚀 Start free today
        </BrandText>
      </div>
    </AuthPageShell>
  );
};

export default UserTypeSelection;
