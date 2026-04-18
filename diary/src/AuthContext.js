import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseErr) {
          throw new Error('Server returned an error but response could not be parsed');
        }
        throw new Error(errorData.message || 'Login failed');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error('Failed to parse server response');
      }

      const newUserId = (data.user && data.user.id) || data.userId;
      const newUsername = data.user && data.user.username;
      if (!newUserId) {
        throw new Error('Invalid response: no user ID received');
      }
      setUserId(newUserId);
      setUsername(newUsername);
      localStorage.setItem('userId', newUserId);
      if (newUsername) {
        localStorage.setItem('username', newUsername);
      }
      return newUserId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseErr) {
          throw new Error('Server returned an error but response could not be parsed');
        }
        throw new Error(errorData.message || 'Registration failed');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error('Failed to parse server response');
      }

      const newUserId = (data.user && data.user.id) || data.userId;
      const newUsername = data.user && data.user.username;
      if (!newUserId) {
        throw new Error('Invalid response: no user ID received');
      }
      setUserId(newUserId);
      setUsername(newUsername);
      localStorage.setItem('userId', newUserId);
      if (newUsername) {
        localStorage.setItem('username', newUsername);
      }
      return newUserId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserId(null);
    setUsername(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  };

  const value = {
    userId,
    username,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!userId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
