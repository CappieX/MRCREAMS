import React, { useEffect, useState } from 'react';
import axios from 'axios/dist/browser/axios.cjs';
import { BrandCard } from '../components/custom/Card';
import { BrandText } from '../components/custom/Typography';
import { BRAND_SPACING } from '../assets/brand';

function EmotionInsightDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/analytics');
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Unable to load analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <BrandText tone="muted">
          Preparing your emotion insights...
        </BrandText>
      );
    }

    if (error) {
      return (
        <BrandText tone="muted">
          {`There was a problem loading your analytics: ${error}`}
        </BrandText>
      );
    }

    if (!analyticsData) {
      return (
        <BrandText tone="soft">
          Not enough data available for emotion insights yet. Share some relationship challenges first to see your emotional patterns.
        </BrandText>
      );
    }

    return (
      <BrandText tone="soft">
        Your emotion analytics are available, and a richer visualization experience is coming soon. For now, keep sharing challenges and completing check-ins to strengthen these insights.
      </BrandText>
    );
  };

  return (
    <div
      style={{
        padding: '24px 16px',
        maxWidth: 960,
        margin: '0 auto'
      }}
    >
      <div
        style={{
          marginBottom: BRAND_SPACING.md
        }}
      >
        <BrandText variant="h2" style={{ marginBottom: 8 }}>
          Emotion Insights
        </BrandText>
        <BrandText variant="body" tone="soft">
          Discover your emotional patterns and relationship dynamics through intelligent analysis and compassionate insights.
        </BrandText>
      </div>

      <BrandCard
        header={{
          title: 'Emotion analytics'
        }}
      >
        {renderContent()}
      </BrandCard>
    </div>
  );
}

export default EmotionInsightDashboard;
