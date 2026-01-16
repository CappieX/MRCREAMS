import { BrandText } from '../components/custom/Typography';
import { BrandButton } from '../components/custom/Button';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../assets/brand';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  const features = [
    { title: 'Emotion Analysis', description: 'Real-time detection across 12+ emotional dimensions', badge: 'AI-Powered' },
    { title: 'Conflict Guidance', description: 'Structured exercises for resolution and reconnection', badge: 'Guided' },
    { title: 'Harmony Score', description: 'Track progress with actionable insights', badge: 'Analytics' },
    { title: 'Privacy & Security', description: 'HIPAA and GDPR aligned safeguards', badge: 'Compliant' },
    { title: 'Therapist Tools', description: 'Session analytics and documentation support', badge: 'Professional' },
  ];

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
        <BrandText variant="h2" style={{ marginBottom: BRAND_SPACING.sm }}>
          Features
        </BrandText>
        <BrandText
          variant="body"
          tone="muted"
          style={{ marginBottom: BRAND_SPACING.xl }}
        >
          Powerful tools for couples and professionals with a unified experience.
        </BrandText>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: BRAND_SPACING.lg
          }}
        >
          {features.map((f) => (
            <article
              key={f.title}
              style={{
                height: '100%',
                borderRadius: BRAND_RADII.lg,
                border: '1px solid rgba(10,37,64,0.08)',
                boxShadow: BRAND_SHADOWS.subtle,
                backgroundColor: '#ffffff',
                padding: BRAND_SPACING.lg
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingInline: 10,
                  paddingBlock: 4,
                  borderRadius: 999,
                  backgroundColor: 'rgba(0,180,216,0.12)',
                  color: BRAND_COLORS.teal,
                  fontSize: 11,
                  fontWeight: 600,
                  marginBottom: BRAND_SPACING.sm
                }}
              >
                {f.badge}
              </span>
              <BrandText variant="h4" style={{ marginBottom: BRAND_SPACING.xs }}>
                {f.title}
              </BrandText>
              <BrandText variant="body" tone="muted">
                {f.description}
              </BrandText>
            </article>
          ))}
        </div>
        <div style={{ marginTop: BRAND_SPACING.xl }}>
          <BrandButton
            type="button"
            onClick={() => navigate('/register')}
          >
            Start Free Trial
          </BrandButton>
        </div>
      </div>
    </section>
  );
};

export default Features;
