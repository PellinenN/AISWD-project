import React, { useState } from 'react';
import { useAuth } from './AuthContext.js';
import './AuthScreen.css';

const SignupScreen = ({ onSwitchToLogin }) => {
  const { signup, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    // Validation
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setSignupError('All fields are required');
      return;
    }

    if (username.length < 3) {
      setSignupError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    try {
      await signup(username, password);
    } catch (err) {
      setSignupError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-username">Username:</label>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password:</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password:</label>
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>

          {(signupError || error) && (
            <div className="error-message">
              {signupError || error}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="toggle-auth">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={isLoading}
              className="toggle-link"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const LoginScreen = ({ onSwitchToSignup }) => {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !password.trim()) {
      setLoginError('Username and password are required');
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1>Diary Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>

          {(loginError || error) && (
            <div className="error-message">
              {loginError || error}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="toggle-auth">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              disabled={isLoading}
              className="toggle-link"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AuthScreen = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return isLoginMode ? (
    <LoginScreen onSwitchToSignup={() => setIsLoginMode(false)} />
  ) : (
    <SignupScreen onSwitchToLogin={() => setIsLoginMode(true)} />
  );
};
