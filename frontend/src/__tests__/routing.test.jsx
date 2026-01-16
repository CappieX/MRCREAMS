import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('Public routes render pages', () => {
  test('/features shows Features page', () => {
    render(
      <MemoryRouter initialEntries={['/features']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Features/i)).toBeInTheDocument();
  });

  test('/pricing shows Pricing page', () => {
    render(
      <MemoryRouter initialEntries={['/pricing']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Pricing/i)).toBeInTheDocument();
  });

  test('/resources shows Resources page', () => {
    render(
      <MemoryRouter initialEntries={['/resources']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Resources/i)).toBeInTheDocument();
  });

  test('/contact shows Contact form', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  test('/about shows About page', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });
});

