import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Testimonials from '../components/landing/Testimonials';

describe('Newsletter form', () => {
  test('submits and shows confirmation', () => {
    render(
      <MemoryRouter>
        <Testimonials />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(emailInput.closest('form'));
    expect(screen.getByText(/Thanks! You’re subscribed./i)).toBeInTheDocument();
  });
});

