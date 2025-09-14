import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import App from '../App';

// Mock all services
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

vi.mock('../services/userService', () => ({
  getUsers: vi.fn(),
}));

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    generateCacheKey: vi.fn(() => 'test-key'),
    clearCache: vi.fn(),
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

const AppWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should complete full login flow', async () => {
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

      render(<AppWrapper />);

      // Should start at login page
      expect(screen.getByText('任务管理系统')).toBeInTheDocument();

      // Fill login form
      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(loginButton);

      // Should call login service
      await waitFor(() => {
        expect(mockAuthService.default.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password',
        });
      });

      // Should store token
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'test-token');
    });

    it('should handle login failure', async () => {
      const user = userEvent.setup();
      
      // Mock failed login
      const mockAuthService = await import('../services/authService');
      mockAuthService.default.login.mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      });

      render(<AppWrapper />);

      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      // Should not store token
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith('access_token', expect.any(String));
    });

    it('should complete registration flow', async () => {
      const user = userEvent.setup();
      
      // Mock successful registration
      const mockAuthService = await import('../services/authService');
      mockAuthService.default.register.mockResolvedValue({
        success: true,
        message: 'Registration successful',
      });

      render(<AppWrapper />);

      // Switch to register tab
      const registerTab = screen.getByText('注册');
      await user.click(registerTab);

      // Fill registration form
      const nameInput = screen.getByPlaceholderText('请输入姓名');
      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const confirmPasswordInput = screen.getByPlaceholderText('请确认密码');
      const registerButton = screen.getByRole('button', { name: '注册' });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(registerButton);

      // Should call register service
      await waitFor(() => {
        expect(mockAuthService.default.register).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });
    });
  });

  describe('Task Management Flow', () => {
    beforeEach(async () => {
      // Mock authenticated user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'test-token';
        if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User' });
        return null;
      });

      // Mock task data
      const mockTaskService = await import('../services/taskService');
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
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        },
      });
    });

    it('should load tasks on dashboard', async () => {
      render(<AppWrapper />);

      // Should navigate to dashboard after login
      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Should load tasks
      const mockTaskService = await import('../services/taskService');
      expect(mockTaskService.getTasks).toHaveBeenCalled();
    });

    it('should create new task', async () => {
      const user = userEvent.setup();
      
      const mockTaskService = await import('../services/taskService');
      mockTaskService.createTask.mockResolvedValue({
        success: true,
        data: {
          id: 2,
          title: 'New Task',
          description: 'New Description',
          status: 'TODO',
          priority: 'MEDIUM',
        },
      });

      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Click create task button
      const createButton = screen.getByRole('button', { name: /新建任务/ });
      await user.click(createButton);

      // Fill task form
      const titleInput = screen.getByPlaceholderText('请输入任务标题');
      const descriptionInput = screen.getByPlaceholderText('请输入任务描述');
      const submitButton = screen.getByRole('button', { name: '确定' });

      await user.type(titleInput, 'New Task');
      await user.type(descriptionInput, 'New Description');
      await user.click(submitButton);

      // Should call create task service
      await waitFor(() => {
        expect(mockTaskService.createTask).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'New Description',
          status: 'TODO',
          priority: 'MEDIUM',
        });
      });
    });

    it('should update task status', async () => {
      const user = userEvent.setup();
      
      const mockTaskService = await import('../services/taskService');
      mockTaskService.updateTask.mockResolvedValue({
        success: true,
        data: { id: 1, status: 'IN_PROGRESS' },
      });

      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Change task status
      const statusSelect = screen.getByRole('combobox');
      await user.click(statusSelect);
      await user.click(screen.getByText('进行中'));

      // Should call update task service
      await waitFor(() => {
        expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, {
          status: 'IN_PROGRESS',
        });
      });
    });

    it('should delete task with confirmation', async () => {
      const user = userEvent.setup();
      
      const mockTaskService = await import('../services/taskService');
      mockTaskService.deleteTask.mockResolvedValue({
        success: true,
        message: 'Task deleted successfully',
      });

      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /删除/ });
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: '确定' });
      await user.click(confirmButton);

      // Should call delete task service
      await waitFor(() => {
        expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Navigation Flow', () => {
    beforeEach(() => {
      // Mock authenticated user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'test-token';
        if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User' });
        return null;
      });
    });

    it('should navigate between pages', async () => {
      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Navigate to calendar
      const calendarLink = screen.getByText('日历');
      await userEvent.click(calendarLink);

      await waitFor(() => {
        expect(screen.getByText('日历管理')).toBeInTheDocument();
      });

      // Navigate to quadrant
      const quadrantLink = screen.getByText('四象限');
      await userEvent.click(quadrantLink);

      await waitFor(() => {
        expect(screen.getByText('四象限分析')).toBeInTheDocument();
      });
    });

    it('should handle logout', async () => {
      const user = userEvent.setup();
      
      const mockAuthService = await import('../services/authService');
      mockAuthService.default.logout.mockResolvedValue({
        success: true,
        message: 'Logged out successfully',
      });

      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Click logout
      const logoutButton = screen.getByText('退出登录');
      await user.click(logoutButton);

      // Should call logout service
      expect(mockAuthService.default.logout).toHaveBeenCalled();

      // Should clear tokens
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByText('任务管理系统')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock network error
      const mockAuthService = await import('../services/authService');
      mockAuthService.default.login.mockRejectedValue(new Error('Network error'));

      render(<AppWrapper />);

      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('网络错误，请检查网络连接')).toBeInTheDocument();
      });
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock API error
      const mockAuthService = await import('../services/authService');
      mockAuthService.default.login.mockResolvedValue({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
        },
      });

      render(<AppWrapper />);

      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password');
      await user.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should load pages within acceptable time', async () => {
      const startTime = performance.now();
      
      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理系统')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load within 1 second
      expect(loadTime).toBeLessThan(1000);
    });

    it('should handle large task lists efficiently', async () => {
      // Mock large task list
      const mockTaskService = await import('../services/taskService');
      const largeTaskList = Array.from({ length: 1000 }, (_, i) => ({
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
          pagination: {
            page: 1,
            limit: 20,
            total: 1000,
            totalPages: 50,
          },
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
      const loadTime = endTime - startTime;

      // Should handle large lists efficiently
      expect(loadTime).toBeLessThan(2000);
    });
  });
});
