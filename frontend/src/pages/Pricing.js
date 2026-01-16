import { BrandText } from '../components/custom/Typography';
import { BrandButton } from '../components/custom/Button';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../assets/brand';
import { useNavigate } from 'react-router-dom';

const tiers = [
  { name: 'Starter', price: '$0', description: 'Try emotion analysis demo and exercises', cta: 'Get Started' },
  { name: 'Couples', price: '$29/mo', description: 'Full access for two, progress tracking and guidance', cta: 'Start Trial' },
  { name: 'Professional', price: '$79/mo', description: 'Session analytics, documentation, client management', cta: 'Request Demo' },
];

const Pricing = () => {
  const navigate = useNavigate();
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
          Pricing
        </BrandText>
        <BrandText
          variant="body"
          tone="muted"
          style={{ marginBottom: BRAND_SPACING.xl }}
        >
          Simple, transparent plans for every stage of your journey.
        </BrandText>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: BRAND_SPACING.lg
          }}
        >
          {tiers.map((t) => (
            <article
              key={t.name}
              style={{
                height: '100%',
                borderRadius: BRAND_RADII.lg,
                border: '1px solid rgba(10,37,64,0.08)',
                boxShadow: BRAND_SHADOWS.subtle,
                backgroundColor: '#ffffff',
                padding: BRAND_SPACING.lg,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <BrandText variant="h4" style={{ marginBottom: BRAND_SPACING.xs }}>
                {t.name}
              </BrandText>
              <BrandText
                variant="h2"
                style={{
                  marginBottom: BRAND_SPACING.sm,
                  color: BRAND_COLORS.teal
                }}
              >
                {t.price}
              </BrandText>
              <BrandText
                variant="body"
                tone="muted"
                style={{ marginBottom: BRAND_SPACING.lg }}
              >
                {t.description}
              </BrandText>
              <BrandButton
                type="button"
                style={{ marginTop: 'auto' }}
                onClick={() => {
                  if (t.name === 'Professional') return navigate('/professional-login');
                  return navigate('/register');
                }}
              >
                {t.cta}
              </BrandButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
