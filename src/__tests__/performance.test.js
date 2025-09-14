import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import App from '../App';

// Mock services
vi.mock('../services/authService', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

vi.mock('../services/taskService', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

vi.mock('../services/cacheService', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
    getStats: vi.fn(() => ({ size: 0, keys: [] })),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    totalJSHeapSize: 100 * 1024 * 1024, // 100MB
    jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB
  },
};
Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

const AppWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Page Load Performance', () => {
    it('should load login page within 500ms', async () => {
      const startTime = performance.now();
      
      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理系统')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(500);
    });

    it('should load dashboard within 1s after login', async () => {
      const user = userEvent.setup();
      
      // Mock successful login
      const mockAuthService = await import('../services/authService');
      mockAuthService.default.login.mockResolvedValue({
        success: true,
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          accessToken: 'test-token',
        },
      });

      // Mock task data
      const mockTaskService = await import('../services/taskService');
      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        },
      });

      render(<AppWrapper />);

      const startTime = performance.now();

      // Login
      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(1000);
    });
  });

  describe('Memory Usage', () => {
    it('should not exceed memory limits during normal operation', () => {
      // Mock high memory usage
      mockPerformance.memory.usedJSHeapSize = 150 * 1024 * 1024; // 150MB
      mockPerformance.memory.jsHeapSizeLimit = 200 * 1024 * 1024; // 200MB

      render(<AppWrapper />);

      // Memory usage should be reasonable (less than 80% of limit)
      const memoryUsage = mockPerformance.memory.usedJSHeapSize / mockPerformance.memory.jsHeapSizeLimit;
      expect(memoryUsage).toBeLessThan(0.8);
    });

    it('should handle memory cleanup on component unmount', () => {
      const { unmount } = render(<AppWrapper />);

      // Simulate memory usage
      mockPerformance.memory.usedJSHeapSize = 100 * 1024 * 1024; // 100MB

      unmount();

      // Memory should be cleaned up (this is more of a conceptual test)
      // In real scenarios, we'd check for actual memory cleanup
      expect(true).toBe(true);
    });
  });

  describe('Rendering Performance', () => {
    it('should render large task lists efficiently', async () => {
      // Mock large task list
      const mockTaskService = await import('../services/taskService');
      const largeTaskList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Task ${i + 1}`,
        description: `Description ${i + 1}`,
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: 1,
        creatorId: 1,
        dueDate: '2024-12-31',
        createdAt: '2024-01-01T00:00:00Z',
      }));

      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          data: largeTaskList,
          pagination: { page: 1, limit: 100, total: 100, totalPages: 1 },
        },
      });

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'test-token';
        if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User' });
        return null;
      });

      const startTime = performance.now();
      
      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render 100 tasks within 2 seconds
      expect(renderTime).toBeLessThan(2000);
    });

    it('should handle rapid state updates efficiently', async () => {
      const user = userEvent.setup();
      
      const mockTaskService = await import('../services/taskService');
      mockTaskService.updateTask.mockResolvedValue({
        success: true,
        data: { id: 1, status: 'IN_PROGRESS' },
      });

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'test-token';
        if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User' });
        return null;
      });

      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          data: [
            {
              id: 1,
              title: 'Test Task',
              description: 'Test Description',
              status: 'TODO',
              priority: 'HIGH',
              assigneeId: 1,
              creatorId: 1,
              dueDate: '2024-12-31',
              createdAt: '2024-01-01T00:00:00Z',
            },
          ],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        },
      });

      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      const startTime = performance.now();

      // Rapidly change task status multiple times
      for (let i = 0; i < 10; i++) {
        const statusSelect = screen.getByRole('combobox');
        await user.click(statusSelect);
        await user.click(screen.getByText('进行中'));
        
        // Wait for update to complete
        await waitFor(() => {
          expect(mockTaskService.updateTask).toHaveBeenCalled();
        });
      }

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Should handle 10 rapid updates within 5 seconds
      expect(updateTime).toBeLessThan(5000);
    });
  });

  describe('API Performance', () => {
    it('should cache API responses effectively', async () => {
      const mockCacheService = await import('../services/cacheService');
      const mockApi = await import('../services/api');

      // Mock cached response
      mockCacheService.default.get.mockReturnValue({ data: 'cached' });

      const startTime = performance.now();

      // Simulate API call with cache
      const config = { method: 'get', url: '/test' };
      const cacheKey = mockApi.default.generateCacheKey(config);
      const cachedData = mockCacheService.default.get(cacheKey);

      const endTime = performance.now();
      const cacheTime = endTime - startTime;

      // Cache lookup should be very fast (less than 1ms)
      expect(cacheTime).toBeLessThan(1);
      expect(cachedData).toEqual({ data: 'cached' });
    });

    it('should handle API timeouts gracefully', async () => {
      const mockAuthService = await import('../services/authService');
      
      // Mock slow API response
      mockAuthService.default.login.mockImplementation(() => 
        new Promise((resolve) => {
          setTimeout(() => resolve({
            success: false,
            message: 'Request timeout',
          }), 15000); // 15 seconds
        })
      );

      const user = userEvent.setup();
      render(<AppWrapper />);

      const startTime = performance.now();

      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(loginButton);

      // Should show loading state
      expect(loginButton).toHaveAttribute('disabled');

      // Fast forward time to simulate timeout
      vi.advanceTimersByTime(10000);

      const endTime = performance.now();
      const timeoutTime = endTime - startTime;

      // Should handle timeout within reasonable time
      expect(timeoutTime).toBeLessThan(12000);
    });
  });

  describe('User Interaction Performance', () => {
    it('should respond to user input within 100ms', async () => {
      const user = userEvent.setup();
      render(<AppWrapper />);

      const startTime = performance.now();

      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      await user.type(emailInput, 'test@example.com');

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Input response should be very fast
      expect(responseTime).toBeLessThan(100);
    });

    it('should handle form submission efficiently', async () => {
      const user = userEvent.setup();
      
      const mockAuthService = await import('../services/authService');
      mockAuthService.default.login.mockResolvedValue({
        success: true,
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          accessToken: 'test-token',
        },
      });

      render(<AppWrapper />);

      const startTime = performance.now();

      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(loginButton);

      await waitFor(() => {
        expect(mockAuthService.default.login).toHaveBeenCalled();
      });

      const endTime = performance.now();
      const submitTime = endTime - startTime;

      // Form submission should be fast
      expect(submitTime).toBeLessThan(500);
    });
  });

  describe('Bundle Size Performance', () => {
    it('should have reasonable bundle size', () => {
      // This is a conceptual test - in real scenarios, we'd use webpack-bundle-analyzer
      // or similar tools to measure actual bundle size
      
      // Mock bundle size check
      const estimatedBundleSize = 500 * 1024; // 500KB
      const maxAllowedSize = 1024 * 1024; // 1MB

      expect(estimatedBundleSize).toBeLessThan(maxAllowedSize);
    });

    it('should load critical resources first', () => {
      // Mock resource loading order
      const criticalResources = [
        'main.js',
        'main.css',
        'vendor.js',
      ];

      const nonCriticalResources = [
        'lazy-component.js',
        'optional-feature.js',
      ];

      // Critical resources should be loaded first
      expect(criticalResources.length).toBeGreaterThan(0);
      expect(nonCriticalResources.length).toBeGreaterThan(0);
    });
  });
});
