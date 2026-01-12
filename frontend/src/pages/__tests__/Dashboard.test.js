import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../context/AuthContext';

// Mock the axios module
jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url.includes('/api/conflicts')) {
      return Promise.resolve({
        data: [
          {
            id: 1,
            conflict_reason: 'Miscommunication about dinner plans',
            fight_degree: 6,
            date: '2023-10-15',
            time_consumption: 20
          },
          {
            id: 2,
            conflict_reason: 'Disagreement about budget',
            fight_degree: 8,
            date: '2023-10-10',
            time_consumption: 30
          }
        ]
      });
    }
    if (url.includes('/api/analytics/dashboard/summary')) {
      return Promise.resolve({
        data: {
          emotionTrends: { totalCheckins: 12 },
          conflictAnalytics: { totalConflicts: 5, resolutionRate: 0.6 },
          progressMetrics: { progressScore: 80 },
          behavioralInsights: { insights: [] }
        }
      });
    }
    if (url.includes('/api/auth/me')) {
      return Promise.resolve({
        data: { user: { metadata: {} } }
      });
    }
    return Promise.resolve({ data: {} });
  })
}));

// Mock the components that might be complex or have external dependencies
jest.mock('../../components/EmotionCheckInWidget', () => () => <div data-testid="emotion-check-in">Emotion Check In Widget</div>);
jest.mock('../../components/EmotionalMapVisualization', () => () => <div data-testid="emotional-map">Emotional Map</div>);
jest.mock('../../components/HarmonyProgressChart', () => () => <div data-testid="harmony-progress">Harmony Progress</div>);
jest.mock('../../components/LiveEmotionPulse', () => () => <div data-testid="live-emotion">Live Emotion</div>);
jest.mock('../../components/PatternRecognitionInsights', () => () => <div data-testid="pattern-recognition">Pattern Recognition</div>);
jest.mock('../../components/subscription/SubscriptionSection', () => () => <div data-testid="subscription-section">Subscription Section</div>);

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders dashboard title and welcome message', async () => {
    renderDashboard();
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to MR.CREAMS/i)).toBeInTheDocument();
  });

  test('renders "Share Challenge" button', () => {
    renderDashboard();
    
    const shareButtons = screen.getAllByRole('link', { name: /share challenge/i });
    const shareButton = shareButtons[0];
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute('href', '/harmony-hub/new');
  });

  test('renders statistics cards with data after loading', async () => {
    renderDashboard();
    
    expect(screen.getByText('Emotional Awareness')).toBeInTheDocument();
    expect(screen.getByText('Harmony Recovery')).toBeInTheDocument();
  });

  test('renders recent harmony opportunities section', () => {
    renderDashboard();
    
    expect(screen.getByText('Recent Harmony Opportunities')).toBeInTheDocument();
  });

  test('renders tailored tips section', () => {
    renderDashboard();
    
    expect(screen.getByText('Tailored Tips')).toBeInTheDocument();
  });

  test('renders AI-powered components', () => {
    renderDashboard();
    
    expect(screen.getByTestId('live-emotion')).toBeInTheDocument();
    expect(screen.getByTestId('pattern-recognition')).toBeInTheDocument();
    expect(screen.getByTestId('emotion-check-in')).toBeInTheDocument();
    expect(screen.getByTestId('emotional-map')).toBeInTheDocument();
    expect(screen.getByTestId('harmony-progress')).toBeInTheDocument();
  });
});
