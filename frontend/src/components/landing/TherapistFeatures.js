import React from 'react';
import { BrandText } from '../custom/Typography';
import { BrandButton } from '../custom/Button';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../../assets/brand';

const features = [
  {
    icon: '🛡️',
    title: 'HIPAA-Compliant Dashboard',
    description: 'Bank-level security with end-to-end encryption.',
    badge: 'GDPR Ready',
  },
  {
    icon: '📊',
    title: 'Advanced Session Analytics',
    description: 'Deep emotional pattern recognition across sessions.',
    feature: 'Export reports to PDF/CSV',
  },
  {
    icon: '🤖',
    title: 'AI-Assisted Documentation',
    description: 'Automated progress notes with therapist review.',
    timeSaved: '40% faster documentation',
  },
  {
    icon: '👥',
    title: 'Multi-Client Management',
    description: 'Manage 50+ clients with individual progress tracking.',
    feature: 'Bulk action support',
  },
  {
    icon: '🔌',
    title: 'Integration Ecosystem',
    description: 'Connect with EHR systems, calendars, payment processors.',
    logos: ['Zoom', 'Google Calendar', 'Stripe', 'TherapyNotes'],
  },
  {
    icon: '🎓',
    title: 'Research & Training',
    description: 'Access to latest emotional intelligence research.',
    feature: 'Continuing education credits',
  },
];

const TherapistFeatures = () => {
  return (
    <section
      style={{
        padding: `${BRAND_SPACING.xl * 2}px ${BRAND_SPACING.md}px`,
        backgroundColor: '#f8fafc'
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: BRAND_SPACING.xl * 1.5
          }}
        >
          <BrandText variant="h2">
            A Smarter Way to Practice
          </BrandText>
          <BrandText
            variant="body"
            tone="muted"
            style={{
              maxWidth: 600,
              margin: '12px auto 0'
            }}
          >
            Our platform provides therapists with the tools to deliver exceptional care and achieve better client outcomes.
          </BrandText>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: BRAND_SPACING.lg
          }}
        >
          {features.map((feature, index) => (
            <article
              key={index}
              style={{
                height: '100%',
                borderRadius: BRAND_RADII.lg,
                boxShadow: BRAND_SHADOWS.subtle,
                backgroundColor: '#ffffff',
                padding: BRAND_SPACING.lg,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 160ms ease-out, box-shadow 160ms ease-out'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: BRAND_SPACING.sm }}>
                {feature.icon}
              </div>
              <BrandText
                variant="h4"
                style={{
                  marginBottom: BRAND_SPACING.sm
                }}
              >
                {feature.title}
              </BrandText>
              <BrandText
                variant="body"
                tone="muted"
                style={{
                  marginBottom: BRAND_SPACING.md,
                  minHeight: 60
                }}
              >
                {feature.description}
              </BrandText>
              {feature.badge && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingInline: 10,
                    paddingBlock: 4,
                    borderRadius: 999,
                    backgroundColor: 'rgba(22,163,74,0.1)',
                    color: '#15803d',
                    fontSize: 11,
                    fontWeight: 600,
                    marginBottom: BRAND_SPACING.sm
                  }}
                >
                  {feature.badge}
                </span>
              )}
              {feature.feature && (
                <BrandText
                  variant="caption"
                  tone="soft"
                  style={{
                    color: BRAND_COLORS.teal,
                    marginBottom: 4
                  }}
                >
                  {feature.feature}
                </BrandText>
              )}
              {feature.timeSaved && (
                <BrandText
                  variant="caption"
                  tone="soft"
                  style={{
                    color: BRAND_COLORS.coral,
                    marginBottom: 4
                  }}
                >
                  {feature.timeSaved}
                </BrandText>
              )}
              {feature.logos && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    alignItems: 'center',
                    marginTop: BRAND_SPACING.sm
                  }}
                >
                  {feature.logos.map((logo, i) => (
                    <span
                      key={i}
                      style={{
                        paddingInline: 10,
                        paddingBlock: 4,
                        borderRadius: 999,
                        backgroundColor: 'rgba(15,23,42,0.04)',
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'rgba(15,23,42,0.8)'
                      }}
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 'auto', paddingTop: BRAND_SPACING.md }}>
                <BrandButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  style={{
                    paddingInline: 0,
                    justifyContent: 'flex-start',
                    color: BRAND_COLORS.teal
                  }}
                >
                  Learn more →
                </BrandButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TherapistFeatures;
