import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import api from '../api';
import cacheService from '../cacheService';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock cacheService
vi.mock('../cacheService', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
    getStats: vi.fn(() => ({ size: 0, keys: [] })),
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset axios mock
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', () => {
      localStorage.setItem('access_token', 'test-token');
      
      const config = {
        method: 'get',
        url: '/test',
        headers: {},
      };

      const interceptor = api.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(config);

      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when no token', () => {
      localStorage.removeItem('access_token');
      
      const config = {
        method: 'get',
        url: '/test',
        headers: {},
      };

      const interceptor = api.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should check cache for GET requests', () => {
      const cachedData = { data: 'cached' };
      cacheService.get.mockReturnValue(cachedData);
      
      const config = {
        method: 'get',
        url: '/test',
        params: { id: 1 },
      };

      const interceptor = api.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(config);

      expect(cacheService.get).toHaveBeenCalled();
      expect(result.data).toBe(cachedData);
      expect(result.fromCache).toBe(true);
    });

    it('should not check cache for non-GET requests', () => {
      const config = {
        method: 'post',
        url: '/test',
        data: { name: 'test' },
      };

      const interceptor = api.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(config);

      expect(cacheService.get).not.toHaveBeenCalled();
      expect(result.fromCache).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('should cache GET responses', () => {
      const response = {
        config: {
          method: 'get',
          url: '/test',
          params: { id: 1 },
        },
        data: { data: 'test' },
        fromCache: false,
      };

      const interceptor = api.interceptors.response.handlers[0];
      const result = interceptor.fulfilled(response);

      expect(cacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        { data: 'test' },
        5 * 60 * 1000
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should not cache responses from cache', () => {
      const response = {
        config: {
          method: 'get',
          url: '/test',
        },
        data: { data: 'test' },
        fromCache: true,
      };

      const interceptor = api.interceptors.response.handlers[0];
      interceptor.fulfilled(response);

      expect(cacheService.set).not.toHaveBeenCalled();
    });

    it('should not cache non-GET responses', () => {
      const response = {
        config: {
          method: 'post',
          url: '/test',
        },
        data: { data: 'test' },
      };

      const interceptor = api.interceptors.response.handlers[0];
      interceptor.fulfilled(response);

      expect(cacheService.set).not.toHaveBeenCalled();
    });

    it('should handle 401 errors by clearing tokens and redirecting', () => {
      const error = {
        response: {
          status: 401,
          data: { error: { message: 'Unauthorized' } },
        },
      };

      const interceptor = api.interceptors.response.handlers[0];
      
      // Mock window.location
      delete window.location;
      window.location = { href: '' };

      expect(() => interceptor.rejected(error)).rejects.toEqual({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401,
      });

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(window.location.href).toBe('/login');
    });

    it('should handle network errors', () => {
      const error = {
        message: 'Network Error',
      };

      const interceptor = api.interceptors.response.handlers[0];
      
      expect(() => interceptor.rejected(error)).rejects.toEqual({
        code: 'NETWORK_ERROR',
        message: '网络错误，请检查网络连接',
      });
    });

    it('should handle response errors with error data', () => {
      const error = {
        response: {
          status: 400,
          data: {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid input',
            },
          },
        },
      };

      const interceptor = api.interceptors.response.handlers[0];
      
      expect(() => interceptor.rejected(error)).rejects.toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        status: 400,
      });
    });

    it('should handle response errors without error data', () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };

      const interceptor = api.interceptors.response.handlers[0];
      
      expect(() => interceptor.rejected(error)).rejects.toEqual({
        code: 'UNKNOWN_ERROR',
        message: '请求失败',
        status: 500,
      });
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate consistent cache keys', () => {
      const config1 = {
        method: 'get',
        url: '/test',
        params: { id: 1 },
        data: { name: 'test' },
      };

      const config2 = {
        method: 'get',
        url: '/test',
        params: { id: 1 },
        data: { name: 'test' },
      };

      const key1 = api.generateCacheKey(config1);
      const key2 = api.generateCacheKey(config2);

      expect(key1).toBe(key2);
      expect(typeof key1).toBe('string');
      expect(key1.length).toBeGreaterThan(0);
    });

    it('should generate different keys for different configs', () => {
      const config1 = {
        method: 'get',
        url: '/test',
        params: { id: 1 },
      };

      const config2 = {
        method: 'get',
        url: '/test',
        params: { id: 2 },
      };

      const key1 = api.generateCacheKey(config1);
      const key2 = api.generateCacheKey(config2);

      expect(key1).not.toBe(key2);
    });
  });

  describe('Cache Clearing', () => {
    it('should clear all cache when no pattern provided', () => {
      cacheService.getStats.mockReturnValue({
        size: 2,
        keys: ['key1', 'key2'],
      });

      api.clearCache();

      expect(cacheService.delete).toHaveBeenCalledWith('key1');
      expect(cacheService.delete).toHaveBeenCalledWith('key2');
    });

    it('should clear cache matching pattern', () => {
      cacheService.getStats.mockReturnValue({
        size: 3,
        keys: ['user-1', 'user-2', 'task-1'],
      });

      api.clearCache('user');

      expect(cacheService.delete).toHaveBeenCalledWith('user-1');
      expect(cacheService.delete).toHaveBeenCalledWith('user-2');
      expect(cacheService.delete).not.toHaveBeenCalledWith('task-1');
    });

    it('should handle empty cache', () => {
      cacheService.getStats.mockReturnValue({
        size: 0,
        keys: [],
      });

      api.clearCache();

      expect(cacheService.delete).not.toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    it('should have correct base configuration', () => {
      expect(api.defaults.baseURL).toBe('http://localhost:3002/api');
      expect(api.defaults.timeout).toBe(10000);
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });
  });
});
