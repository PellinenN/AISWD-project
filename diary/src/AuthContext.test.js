import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access auth context
const TestComponent = () => {
  const { userId, isLoading, error, signup, login, logout } = useAuth();
  const [testError, setTestError] = React.useState(null);

  const handleSignup = async (username, password) => {
    try {
      setTestError(null);
      const result = await signup(username, password);
      return result;
    } catch (err) {
      setTestError(err.message);
      // Don't re-throw - let the error be captured in the context state
    }
  };

  const handleLogin = async (username, password) => {
    try {
      setTestError(null);
      const result = await login(username, password);
      return result;
    } catch (err) {
      setTestError(err.message);
      // Don't re-throw - let the error be captured in the context state
    }
  };

  return (
    <div>
      <div data-testid="userId">{userId || 'null'}</div>
      <div data-testid="isLoading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="error">{error || 'null'}</div>
      <div data-testid="testError">{testError || 'null'}</div>
      <button data-testid="signup-btn" onClick={() => handleSignup('testuser', 'password123')}>
        Sign Up
      </button>
      <button data-testid="login-btn" onClick={() => handleLogin('testuser', 'password123')}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext - signup method', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('successful signup', () => {
    test('should successfully signup with valid credentials', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              user: { id: 'user123', username: 'testuser' },
              token: 'mock-token',
            }),
        })
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      await act(async () => {
        signupBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('userId')).toHaveTextContent('user123');
      });

      // Verify fetch was called with correct endpoint and data
      expect(global.fetch).toHaveBeenCalledWith('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });

      // Verify userId is stored in localStorage
      expect(localStorage.getItem('userId')).toBe('user123');
    });

    test('should handle userId from data.userId fallback', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              userId: 'user456', // Alternative response format
              token: 'mock-token',
            }),
        })
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      await act(async () => {
        signupBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('userId')).toHaveTextContent('user456');
      });
    });
  });

  describe('signup failure scenarios', () => {
    test('should handle duplicate username error', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              success: false,
              message: 'Username already exists',
            }),
        })
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      await act(async () => {
        signupBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Username already exists');
      });

      // User should not be logged in
      expect(screen.getByTestId('userId')).toHaveTextContent('null');
      expect(localStorage.getItem('userId')).toBeNull();
    });

    test('should handle generic registration failed error', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}), // No message property
        })
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      await act(async () => {
        signupBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Registration failed');
      });
    });

    test('should handle network errors', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      await act(async () => {
        signupBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });

    test('should handle JSON parse errors (<!DOCTYPE case)', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.reject(new Error('Unexpected token < in JSON at position 0')),
        })
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      await act(async () => {
        signupBtn.click();
      });

      await waitFor(() => {
        // The actual error thrown is about response parsing, not the token error
        expect(screen.getByTestId('error')).toHaveTextContent('could not be parsed');
      });
    });
  });

  describe('loading states', () => {
    test('should set isLoading to true during signup', async () => {
      let resolveSignup;
      global.fetch = jest.fn(
        () =>
          new Promise((resolve) => {
            resolveSignup = () =>
              resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    success: true,
                    user: { id: 'user123', username: 'testuser' },
                  }),
              });
          })
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const signupBtn = screen.getByTestId('signup-btn');

      act(() => {
        signupBtn.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('true');
      });

      act(() => {
        resolveSignup();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });
    });
  });

  describe('localStorage persistence', () => {
    test('should restore userId from localStorage on provider mount', async () => {
      localStorage.setItem('userId', 'restored-user-123');

      const { rerender } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('userId')).toHaveTextContent('restored-user-123');
      });

      // Should not be loading after mount
      expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
    });

    test('should clear localStorage on logout', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              user: { id: 'user123', username: 'testuser' },
              token: 'mock-token',
            }),
        })
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Sign up first
      const signupBtn = screen.getByTestId('signup-btn');
      await act(async () => {
        signupBtn.click();
      });

      await waitFor(() => {
        expect(localStorage.getItem('userId')).toBe('user123');
      });

      // Now logout
      const logoutBtn = screen.getByTestId('logout-btn');
      act(() => {
        logoutBtn.click();
      });

      // UserId should be cleared
      expect(screen.getByTestId('userId')).toHaveTextContent('null');
      expect(localStorage.getItem('userId')).toBeNull();
    });
  });
});
