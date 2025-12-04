/**
 * Token helper utilities for JWT token management
 */

export const tokenHelper = {
  /**
   * Check if token exists and is valid format
   */
  hasToken: () => {
    const token = localStorage.getItem('token');
    return token && token.length > 0;
  },

  /**
   * Get token from localStorage
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if token is expired (basic check - JWT format)
   */
  isTokenValid: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Basic JWT format check (should have 3 parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Decode payload to check expiration (basic check)
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      return exp > now;
    } catch (e) {
      console.error('Token validation error:', e);
      return false;
    }
  },

  /**
   * Clear all authentication data
   */
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get user data from localStorage
   */
  getUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  },
};

