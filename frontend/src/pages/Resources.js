import { BrandText } from '../components/custom/Typography';
import { BrandButton } from '../components/custom/Button';
import { BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../assets/brand';
import { useNavigate } from 'react-router-dom';

const items = [
  { title: 'Guide: Active Listening', summary: 'Improve communication with structured steps' },
  { title: 'Blog: Emotion Patterns', summary: 'Understanding triggers and reactions' },
  { title: 'Worksheet: Appreciation', summary: 'Practice gratitude with prompts' },
];

const Resources = () => {
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
          Resources
        </BrandText>
        <BrandText
          variant="body"
          tone="muted"
          style={{ marginBottom: BRAND_SPACING.xl }}
        >
          Practical guides and insights to strengthen relationships.
        </BrandText>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: BRAND_SPACING.lg
          }}
        >
          {items.map((i) => (
            <article
              key={i.title}
              style={{
                borderRadius: BRAND_RADII.lg,
                boxShadow: BRAND_SHADOWS.subtle,
                backgroundColor: '#ffffff',
                padding: BRAND_SPACING.lg,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <BrandText variant="h4" style={{ marginBottom: BRAND_SPACING.xs }}>
                {i.title}
              </BrandText>
              <BrandText
                variant="body"
                tone="muted"
                style={{ marginBottom: BRAND_SPACING.md }}
              >
                {i.summary}
              </BrandText>
              <BrandButton
                type="button"
                variant="ghost"
                size="sm"
                style={{ paddingInline: 0, marginTop: 'auto' }}
                onClick={() => navigate('/register')}
              >
                Read
              </BrandButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
