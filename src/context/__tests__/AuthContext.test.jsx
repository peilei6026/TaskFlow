import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';
import authService from '../../services/authService';

// Mock authService
vi.mock('../../services/authService', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const TestComponent = ({ onAuthData }) => {
  const auth = useAuth();

  React.useEffect(() => {
    if (onAuthData) {
      onAuthData(auth);
    }
  }, [auth, onAuthData]);

  return (
    <div>
      <div data-testid="user">{auth.user ? auth.user.name : 'No user'}</div>
      <div data-testid="loading">{auth.loading ? 'Loading' : 'Not loading'}</div>
      <button onClick={() => auth.login({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={() => auth.register({ name: 'Test', email: 'test@example.com', password: 'password' })}>
        Register
      </button>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('provides initial state correctly', () => {
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });

  it('loads user from localStorage on mount', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    authService.getCurrentUser.mockReturnValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const mockResponse = { success: true, data: { user: mockUser, token: 'test-token' } };

    authService.login.mockResolvedValue(mockResponse);
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('handles login failure', async () => {
    const user = userEvent.setup();
    const mockResponse = { success: false, error: { message: 'Invalid credentials' } };

    authService.login.mockResolvedValue(mockResponse);
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });
  });

  it('handles successful registration', async () => {
    const user = userEvent.setup();
    const mockResponse = { success: true, message: 'Registration successful' };

    authService.register.mockResolvedValue(mockResponse);
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    await user.click(registerButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@example.com',
        password: 'password'
      });
    });
  });

  it('handles logout', async () => {
    const user = userEvent.setup();
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

    authService.getCurrentUser.mockReturnValue(mockUser);
    authService.logout.mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial user should be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });

    expect(authService.logout).toHaveBeenCalled();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});