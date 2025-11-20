import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock the axios module
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      totalConflicts: 5,
      averageIntensity: 7,
      averageDuration: 25,
      topReason: 'Communication',
      conflicts: [
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
    }
  }))
}));

// Mock the components that might be complex or have external dependencies
jest.mock('../components/EmotionCheckInWidget', () => () => <div data-testid="emotion-check-in">Emotion Check In Widget</div>);
jest.mock('../components/EmotionalMapVisualization', () => () => <div data-testid="emotional-map">Emotional Map</div>);
jest.mock('../components/HarmonyProgressChart', () => () => <div data-testid="harmony-progress">Harmony Progress</div>);
jest.mock('../components/LiveEmotionPulse', () => () => <div data-testid="live-emotion">Live Emotion</div>);
jest.mock('../components/PatternRecognitionInsights', () => () => <div data-testid="pattern-recognition">Pattern Recognition</div>);

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
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
    
    const shareButton = screen.getByRole('link', { name: /share challenge/i });
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute('href', '/harmony-hub/new');
  });

  test('renders statistics cards with data after loading', async () => {
    renderDashboard();
    
    // Initially shows loading indicators
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // totalConflicts
      expect(screen.getByText('7/10')).toBeInTheDocument(); // averageIntensity
      expect(screen.getByText('25 min')).toBeInTheDocument(); // averageDuration
      expect(screen.getByText('Communication')).toBeInTheDocument(); // topReason
    });
  });

  test('renders recent conflicts list after loading', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Miscommunication about dinner plans')).toBeInTheDocument();
      expect(screen.getByText('Disagreement about budget')).toBeInTheDocument();
    });
  });

  test('renders quick tips section', () => {
    renderDashboard();
    
    expect(screen.getByText('Quick Tips')).toBeInTheDocument();
    expect(screen.getByText('Listen actively')).toBeInTheDocument();
    expect(screen.getByText('Use \'I\' statements')).toBeInTheDocument();
    expect(screen.getByText('Take breaks when needed')).toBeInTheDocument();
    expect(screen.getByText('Focus on the issue')).toBeInTheDocument();
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