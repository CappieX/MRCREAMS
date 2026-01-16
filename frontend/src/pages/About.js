import { BrandText } from '../components/custom/Typography';
import { BRAND_SPACING } from '../assets/brand';

const About = () => {
  return (
    <section
      style={{
        padding: `${BRAND_SPACING.xl * 2}px ${BRAND_SPACING.md}px`,
        backgroundColor: '#f8fafc'
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto'
        }}
      >
        <BrandText variant="h2" style={{ marginBottom: BRAND_SPACING.sm }}>
          About
        </BrandText>
        <BrandText
          variant="body"
          tone="muted"
          style={{ marginBottom: BRAND_SPACING.xl }}
        >
          Building emotionally intelligent technology for healthier relationships.
        </BrandText>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: BRAND_SPACING.lg
          }}
        >
          <div>
            <BrandText variant="h4" style={{ marginBottom: BRAND_SPACING.xs }}>
              Mission
            </BrandText>
            <BrandText variant="body" tone="muted">
              Help couples and professionals understand emotions, resolve conflicts, and grow together.
            </BrandText>
          </div>
          <div>
            <BrandText variant="h4" style={{ marginBottom: BRAND_SPACING.xs }}>
              Approach
            </BrandText>
            <BrandText variant="body" tone="muted">
              Combine AI insights with clinically informed guidance, respecting privacy and security.
            </BrandText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
