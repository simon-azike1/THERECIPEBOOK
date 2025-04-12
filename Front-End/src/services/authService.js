import axios from 'axios';

const BASE_URL = 'https://therecipebook-4uw5.onrender.com/api/v1/user';

const authService = {
  register: async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    if (response.data.result.data.token) {
      localStorage.setItem('userToken', response.data.result.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.result.data.user));
    }
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await axios.get(`${BASE_URL}/verify-email?token=${token}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  },

  sendResetEmail: async (email) => {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await axios.post(`${BASE_URL}/reset-password`, { token, password });
    return response.data;
  }
};

export default authService; 