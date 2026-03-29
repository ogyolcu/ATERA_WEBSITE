import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Set up axios interceptor for auth header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = checking, false = not auth, object = auth
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(false);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.log('Auth check failed:', error.message);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { access_token, refresh_token, ...userData } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(false);
  };

  const refreshToken = async () => {
    const token = localStorage.getItem('refresh_token');
    if (!token) {
      setUser(false);
      return false;
    }
    try {
      const response = await axios.post(`${API}/auth/refresh`, { refresh_token: token });
      localStorage.setItem('access_token', response.data.access_token);
      await checkAuth();
      return true;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshToken, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
