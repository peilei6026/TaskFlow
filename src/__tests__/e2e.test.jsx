import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import App from '../App';

// Mock all services with realistic responses
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

vi.mock('../services/calendarService', () => ({
  getEvents: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

vi.mock('../services/quadrantService', () => ({
  getAnalysis: vi.fn(),
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

describe('End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete User Journey', () => {
    it('should complete full user workflow from registration to task management', async () => {
      const user = userEvent.setup();
      
      // Mock services
      const mockAuthService = await import('../services/authService');
      const mockTaskService = await import('../services/taskService');
      const mockUserService = await import('../services/userService');
      const mockCalendarService = await import('../services/calendarService');
      const mockQuadrantService = await import('../services/quadrantService');

      // Mock registration
      mockAuthService.default.register.mockResolvedValue({
        success: true,
        message: 'Registration successful',
      });

      // Mock login
      mockAuthService.default.login.mockResolvedValue({
        success: true,
        data: {
          user: { id: 1, name: 'New User', email: 'newuser@example.com', role: 'USER' },
          accessToken: 'new-token',
        },
      });

      // Mock initial data
      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        },
      });

      mockUserService.getUsers.mockResolvedValue({
        success: true,
        data: [
          { id: 1, name: 'New User', email: 'newuser@example.com' },
        ],
      });

      mockCalendarService.getEvents.mockResolvedValue({
        success: true,
        data: [],
      });

      mockQuadrantService.getAnalysis.mockResolvedValue({
        success: true,
        data: {
          urgent_important: [],
          not_urgent_important: [],
          urgent_not_important: [],
          not_urgent_not_important: [],
        },
      });

      render(<AppWrapper />);

      // Step 1: Registration
      expect(screen.getByText('任务管理系统')).toBeInTheDocument();
      
      const registerTab = screen.getByText('注册');
      await user.click(registerTab);

      const nameInput = screen.getByPlaceholderText('请输入姓名');
      const emailInput = screen.getByPlaceholderText('请输入邮箱');
      const passwordInput = screen.getByPlaceholderText('请输入密码');
      const confirmPasswordInput = screen.getByPlaceholderText('请确认密码');
      const registerButton = screen.getByRole('button', { name: '注册' });

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(registerButton);

      await waitFor(() => {
        expect(mockAuthService.default.register).toHaveBeenCalledWith({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });

      // Step 2: Login
      const loginTab = screen.getByText('登录');
      await user.click(loginTab);

      const loginEmailInput = screen.getByPlaceholderText('请输入邮箱');
      const loginPasswordInput = screen.getByPlaceholderText('请输入密码');
      const loginButton = screen.getByRole('button', { name: '登录' });

      await user.type(loginEmailInput, 'newuser@example.com');
      await user.type(loginPasswordInput, 'password123');
      await user.click(loginButton);

      await waitFor(() => {
        expect(mockAuthService.default.login).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'password123',
        });
      });

      // Step 3: Dashboard navigation
      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Step 4: Create first task
      mockTaskService.createTask.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          title: 'My First Task',
          description: 'This is my first task',
          status: 'TODO',
          priority: 'HIGH',
          assigneeId: 1,
          creatorId: 1,
          dueDate: '2024-12-31',
          createdAt: '2024-01-01T00:00:00Z',
        },
      });

      const createButton = screen.getByRole('button', { name: /新建任务/ });
      await user.click(createButton);

      const taskTitleInput = screen.getByPlaceholderText('请输入任务标题');
      const taskDescriptionInput = screen.getByPlaceholderText('请输入任务描述');
      const taskSubmitButton = screen.getByRole('button', { name: '确定' });

      await user.type(taskTitleInput, 'My First Task');
      await user.type(taskDescriptionInput, 'This is my first task');
      await user.click(taskSubmitButton);

      await waitFor(() => {
        expect(mockTaskService.createTask).toHaveBeenCalledWith({
          title: 'My First Task',
          description: 'This is my first task',
          status: 'TODO',
          priority: 'HIGH',
        });
      });

      // Step 5: Navigate to different sections
      const calendarLink = screen.getByText('日历');
      await user.click(calendarLink);

      await waitFor(() => {
        expect(screen.getByText('日历管理')).toBeInTheDocument();
      });

      const quadrantLink = screen.getByText('四象限');
      await user.click(quadrantLink);

      await waitFor(() => {
        expect(screen.getByText('四象限分析')).toBeInTheDocument();
      });

      const tasksLink = screen.getByText('任务');
      await user.click(tasksLink);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Step 6: Logout
      const logoutButton = screen.getByText('退出登录');
      await user.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByText('任务管理系统')).toBeInTheDocument();
      });
    });

    it('should handle complete task lifecycle', async () => {
      const user = userEvent.setup();
      
      // Mock authenticated user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'test-token';
        if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User', email: 'test@example.com' });
        return null;
      });

      const mockTaskService = await import('../services/taskService');
      const mockUserService = await import('../services/userService');

      // Mock initial task data
      const initialTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          status: 'TODO',
          priority: 'HIGH',
          assigneeId: 1,
          creatorId: 1,
          dueDate: '2024-12-31',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          assigneeId: 1,
          creatorId: 1,
          dueDate: '2024-12-30',
          createdAt: '2024-01-02T00:00:00Z',
        },
      ];

      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          data: initialTasks,
          pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
        },
      });

      mockUserService.getUsers.mockResolvedValue({
        success: true,
        data: [
          { id: 1, name: 'Test User', email: 'test@example.com' },
        ],
      });

      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Step 1: View tasks
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();

      // Step 2: Update task status
      mockTaskService.updateTask.mockResolvedValue({
        success: true,
        data: { id: 1, status: 'IN_PROGRESS' },
      });

      const statusSelects = screen.getAllByRole('combobox');
      const firstStatusSelect = statusSelects[0];
      
      await user.click(firstStatusSelect);
      await user.click(screen.getByText('进行中'));

      await waitFor(() => {
        expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, {
          status: 'IN_PROGRESS',
        });
      });

      // Step 3: Update task priority
      mockTaskService.updateTask.mockResolvedValue({
        success: true,
        data: { id: 1, priority: 'LOW' },
      });

      const prioritySelects = screen.getAllByRole('combobox');
      const firstPrioritySelect = prioritySelects[1];
      
      await user.click(firstPrioritySelect);
      await user.click(screen.getByText('低'));

      await waitFor(() => {
        expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, {
          priority: 'LOW',
        });
      });

      // Step 4: Create new task
      mockTaskService.createTask.mockResolvedValue({
        success: true,
        data: {
          id: 3,
          title: 'New Task',
          description: 'New Description',
          status: 'TODO',
          priority: 'MEDIUM',
          assigneeId: 1,
          creatorId: 1,
          dueDate: '2024-12-25',
          createdAt: '2024-01-03T00:00:00Z',
        },
      });

      const createButton = screen.getByRole('button', { name: /新建任务/ });
      await user.click(createButton);

      const taskTitleInput = screen.getByPlaceholderText('请输入任务标题');
      const taskDescriptionInput = screen.getByPlaceholderText('请输入任务描述');
      const taskSubmitButton = screen.getByRole('button', { name: '确定' });

      await user.type(taskTitleInput, 'New Task');
      await user.type(taskDescriptionInput, 'New Description');
      await user.click(taskSubmitButton);

      await waitFor(() => {
        expect(mockTaskService.createTask).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'New Description',
          status: 'TODO',
          priority: 'MEDIUM',
        });
      });

      // Step 5: Delete task
      mockTaskService.deleteTask.mockResolvedValue({
        success: true,
        message: 'Task deleted successfully',
      });

      const deleteButtons = screen.getAllByRole('button', { name: /删除/ });
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', { name: '确定' });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
      });
    });

    it('should handle error scenarios gracefully', async () => {
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

      // Should not navigate to dashboard
      expect(screen.queryByText('任务管理')).not.toBeInTheDocument();
    });

    it('should handle concurrent user actions', async () => {
      const user = userEvent.setup();
      
      // Mock authenticated user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'test-token';
        if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User', email: 'test@example.com' });
        return null;
      });

      const mockTaskService = await import('../services/taskService');
      const mockUserService = await import('../services/userService');

      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          data: [
            {
              id: 1,
              title: 'Task 1',
              description: 'Description 1',
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

      mockUserService.getUsers.mockResolvedValue({
        success: true,
        data: [
          { id: 1, name: 'Test User', email: 'test@example.com' },
        ],
      });

      render(<AppWrapper />);

      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });

      // Simulate rapid user actions
      const statusSelect = screen.getByRole('combobox');
      const createButton = screen.getByRole('button', { name: /新建任务/ });

      // Rapidly click multiple elements
      await user.click(statusSelect);
      await user.click(createButton);
      await user.click(statusSelect);

      // Should handle concurrent actions without errors
      expect(screen.getByText('任务管理')).toBeInTheDocument();
    });
  });

  describe('Cross-Browser Compatibility', () => {
    it('should work with different screen sizes', async () => {
      // Mock different screen sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile width
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667, // Mobile height
      });

      render(<AppWrapper />);

      // Should render on mobile
      expect(screen.getByText('任务管理系统')).toBeInTheDocument();

      // Reset to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      });

      // Should still work on desktop
      expect(screen.getByText('任务管理系统')).toBeInTheDocument();
    });
  });

  describe('Data Persistence', () => {
    it('should persist user session across page refreshes', async () => {
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

      mockAuthService.default.getCurrentUser.mockReturnValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      });

      const mockTaskService = await import('../services/taskService');
      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        },
      });

      render(<AppWrapper />);

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

      // Simulate page refresh
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'test-token';
        if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User', email: 'test@example.com' });
        return null;
      });

      // Re-render to simulate refresh
      render(<AppWrapper />);

      // Should maintain session
      await waitFor(() => {
        expect(screen.getByText('任务管理')).toBeInTheDocument();
      });
    });
  });
});
