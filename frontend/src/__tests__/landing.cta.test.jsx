import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroSection from '../components/landing/HeroSection';
import EmotionAnalysisDemo from '../components/landing/EmotionAnalysisDemo';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

describe('Landing CTAs and mobile menu', () => {
  test('mobile menu opens via hamburger icon', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );
    const menuButton = screen.getByLabelText(/open menu/i);
    fireEvent.click(menuButton);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('emotion demo CTA navigates to registration', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);
    render(
      <MemoryRouter>
        <EmotionAnalysisDemo />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Try It Free - No Account Needed/i));
    expect(navigateMock).toHaveBeenCalledWith('/register');
  });
});
