import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/user';

const authService = {
  register: async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    if (response.data.result.data.token) {
      localStorage.setItem('token', response.data.result.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.result.data.user));
    }
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await axios.get(`${BASE_URL}/verify-email?token=${token}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService; 