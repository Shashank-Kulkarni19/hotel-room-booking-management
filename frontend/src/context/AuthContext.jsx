import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { token, id, name, email: userEmail, role } = response;

      localStorage.setItem('token', token);
      const userData = { id, name, email: userEmail, role };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, role };
    } catch (error) {
      return {
        success: false,
        error: error.formattedMessage || error.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authApi.register({ name, email, password });
      const { token, id, name: userName, email: userEmail, role } = response;

      localStorage.setItem('token', token);
      const userData = { id, name: userName, email: userEmail, role };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, role };
    } catch (error) {
      // Handle validation errors from backend
      let errorMessage = 'Registration failed';

      if (error.response?.data) {
        const errorData = error.response.data;

        // Check for message field (general error)
        if (errorData.message) {
          errorMessage = errorData.message;
        }

        // Check for validation errors object
        if (errorData.errors) {
          // Get first validation error
          const firstError = Object.values(errorData.errors)[0];
          errorMessage = firstError || errorMessage;
        }

        // Check for direct field errors (legacy format)
        if (typeof errorData === 'object' && !errorData.message && !errorData.errors) {
          const firstError = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ROLE_ADMIN';
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
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

