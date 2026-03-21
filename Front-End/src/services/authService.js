import axios from 'axios';

import { USER_API } from '../config/api';
const API_URL = USER_API;

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.result?.message || 'Registration failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('An error occurred during registration');
      }
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data?.result?.data?.token) {
        localStorage.setItem('userToken', response.data.result.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.result.data.user));
      }
      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.result?.message || 'Login failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request made but no response received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error('An error occurred during login');
      }
    }
  },

  verifyEmail: async (token) => {
    const response = await axios.get(`${API_URL}/verify-email?token=${token}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  },

  sendResetEmail: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await axios.post(`${API_URL}/reset-password`, { token, password });
    return response.data;
  }
};

export default authService; 