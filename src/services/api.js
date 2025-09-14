import axios from 'axios';
import cacheService from './cacheService';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3002/api', // 直接访问后端API地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 生成缓存键
const generateCacheKey = (config) => {
  const { method, url, params, data } = config;
  const key = `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
  // 使用encodeURIComponent代替btoa来处理中文字符
  return encodeURIComponent(key).replace(/[^a-zA-Z0-9]/g, '');
};

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 检查缓存（仅对GET请求）
    if (config.method === 'get') {
      const cacheKey = generateCacheKey(config);
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        // 返回缓存的Promise
        return Promise.resolve({
          ...config,
          data: cachedData,
          fromCache: true,
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 缓存GET请求的响应
    if (response.config.method === 'get' && !response.fromCache) {
      const cacheKey = generateCacheKey(response.config);
      cacheService.set(cacheKey, response.data, 5 * 60 * 1000); // 5分钟缓存
    }

    return response.data;
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      const { status, data } = error.response;

      // 401未授权，清除token并跳转到登录页
      if (status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // 避免无限重定向，只在不是登录页时跳转
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // 返回错误信息
      return Promise.reject({
        code: data?.error?.code || 'UNKNOWN_ERROR',
        message: data?.error?.message || '请求失败',
        status
      });
    }

    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: '网络错误，请检查网络连接',
    });
  }
);

// 清除相关缓存
api.clearCache = (pattern) => {
  const stats = cacheService.getStats();
  stats.keys.forEach(key => {
    if (pattern ? key.includes(pattern) : true) {
      cacheService.delete(key);
    }
  });
};

export default api;