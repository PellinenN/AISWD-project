import React, { useState } from 'react';
import { useAuth } from './AuthContext.js';
import './AuthScreen.css';

export const LoginScreen = () => {
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
        </form>
      </div>
    </div>
  );
};
