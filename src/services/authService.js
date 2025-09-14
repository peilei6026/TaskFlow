import api from './api';

const authService = {
  // 用户登录
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.success && response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }
    return response;
  },

  // 用户注册
  register: async (userData) => {
    // 过滤掉后端不需要的字段
    const { confirmPassword, ...validUserData } = userData;
    return await api.post('/auth/register', validUserData);
  },

  // 用户登出
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // 获取当前用户信息
  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  // 刷新token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    if (response.success && response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }
    return response;
  },

  // 检查是否已登录
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // 获取存储的token
  getToken: () => {
    return localStorage.getItem('access_token');
  }
};

export default authService;