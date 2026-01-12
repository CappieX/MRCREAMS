import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    login: jest.fn().mockImplementation((email, password) => {
      if (email === 'test@example.com' && password === 'password123') {
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    }),
    loading: false,
  }),
}));

const renderLoginComponent = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  test('renders login form correctly', () => {
    renderLoginComponent();
    
    const userForm = screen.getByRole('main');

    expect(within(userForm).getByLabelText(/email address/i)).toBeInTheDocument();
    expect(within(userForm).getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(within(userForm).getByRole('button', { name: /sign in as user/i })).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    expect(screen.getByText(/professional login/i)).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    renderLoginComponent();
    
    const userForm = screen.getByRole('main');

    const emailInput = within(userForm).getByLabelText(/email address/i);
    const passwordInput = within(userForm).getByLabelText(/^Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', () => {
    renderLoginComponent();
    
    const userForm = screen.getByRole('main');

    const passwordInput = within(userForm).getByLabelText(/^Password/i);
    expect(passwordInput.type).toBe('password');
    
    const visibilityToggle = within(userForm).getByLabelText(/toggle password visibility/i);
    fireEvent.click(visibilityToggle);
    
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(visibilityToggle);
    expect(passwordInput.type).toBe('password');
  });

  test('submits form with valid credentials', async () => {
    renderLoginComponent();
    
    const userForm = screen.getByRole('main');

    const emailInput = within(userForm).getByLabelText(/email address/i);
    const passwordInput = within(userForm).getByLabelText(/^Password/i);
    const submitButton = within(userForm).getByRole('button', { name: /sign in as user/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  test('shows error message with invalid credentials', async () => {
    renderLoginComponent();
    
    const userForm = screen.getByRole('main');

    const emailInput = within(userForm).getByLabelText(/email address/i);
    const passwordInput = within(userForm).getByLabelText(/^Password/i);
    const submitButton = within(userForm).getByRole('button', { name: /sign in as user/i });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});