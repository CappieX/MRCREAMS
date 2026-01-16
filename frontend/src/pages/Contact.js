import { useState } from 'react';
import { BrandText } from '../components/custom/Typography';
import { BrandButton } from '../components/custom/Button';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../assets/brand';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section
      style={{
        padding: `${BRAND_SPACING.xl * 2}px ${BRAND_SPACING.md}px`,
        backgroundColor: '#f8fafc'
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto'
        }}
      >
        <BrandText variant="h2" style={{ marginBottom: BRAND_SPACING.sm }}>
          Contact
        </BrandText>
        <BrandText
          variant="body"
          tone="muted"
          style={{ marginBottom: BRAND_SPACING.lg }}
        >
          Reach out for support, partnerships, or media inquiries.
        </BrandText>
        <div
          style={{
            borderRadius: BRAND_RADII.lg,
            boxShadow: BRAND_SHADOWS.subtle,
            backgroundColor: '#ffffff',
            padding: BRAND_SPACING.lg
          }}
        >
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', marginBottom: BRAND_SPACING.md }}>
              <BrandText variant="caption" tone="muted">
                Name
              </BrandText>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  marginTop: 4,
                  width: '100%',
                  borderRadius: BRAND_RADII.md,
                  border: '1px solid rgba(15,23,42,0.18)',
                  padding: '10px 12px',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: BRAND_SPACING.md }}>
              <BrandText variant="caption" tone="muted">
                Email
              </BrandText>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  marginTop: 4,
                  width: '100%',
                  borderRadius: BRAND_RADII.md,
                  border: '1px solid rgba(15,23,42,0.18)',
                  padding: '10px 12px',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: BRAND_SPACING.md }}>
              <BrandText variant="caption" tone="muted">
                Message
              </BrandText>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                style={{
                  marginTop: 4,
                  width: '100%',
                  borderRadius: BRAND_RADII.md,
                  border: '1px solid rgba(15,23,42,0.18)',
                  padding: '10px 12px',
                  fontSize: 14,
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </label>
            <BrandButton
              type="submit"
              style={{
                backgroundColor: BRAND_COLORS.teal
              }}
            >
              Send
            </BrandButton>
            {submitted && (
              <BrandText
                variant="caption"
                tone="soft"
                style={{ display: 'block', marginTop: BRAND_SPACING.sm }}
              >
                Thanks, we’ll be in touch.
              </BrandText>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
