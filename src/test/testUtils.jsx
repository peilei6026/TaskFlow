import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';

// Mock data generators
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
  status: 'ACTIVE',
  displayName: 'Test User',
  department: 'IT',
  position: 'Developer',
  avatar: null,
  phone: '1234567890',
  lastLoginAt: '2024-01-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockTask = (overrides = {}) => ({
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO',
  priority: 'HIGH',
  assigneeId: 1,
  creatorId: 1,
  tags: null,
  estimatedHours: 8,
  actualHours: 0,
  progress: 0,
  dueDate: '2024-12-31T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  assignee: createMockUser(),
  creator: createMockUser(),
  comments: [],
  timeEntries: [],
  ...overrides,
});

export const createMockCalendarEvent = (overrides = {}) => ({
  id: 1,
  title: 'Test Event',
  description: 'Test Event Description',
  startTime: '2024-01-01T09:00:00Z',
  endTime: '2024-01-01T10:00:00Z',
  type: 'MEETING',
  location: 'Conference Room A',
  attendees: JSON.stringify(['user1@example.com', 'user2@example.com']),
  userId: 1,
  allDay: false,
  recurring: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  user: createMockUser(),
  ...overrides,
});

export const createMockApiResponse = (data, overrides = {}) => ({
  success: true,
  data,
  message: 'Success',
  ...overrides,
});

export const createMockErrorResponse = (message, code = 'UNKNOWN_ERROR') => ({
  success: false,
  error: {
    code,
    message,
  },
});

// Mock service responses
export const mockAuthService = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
};

export const mockTaskService = {
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
};

export const mockUserService = {
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
};

export const mockCalendarService = {
  getEvents: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
};

export const mockQuadrantService = {
  getAnalysis: vi.fn(),
};

// Test wrapper component
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (ui, options = {}) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Test helpers
export const waitForLoadingToFinish = () => {
  return waitFor(() => {
    expect(screen.queryByText('加载中...')).not.toBeInTheDocument();
  });
};

export const waitForErrorToAppear = (errorMessage) => {
  return waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
};

export const waitForSuccessMessage = (message) => {
  return waitFor(() => {
    expect(screen.getByText(message)).toBeInTheDocument();
  });
};

// Form helpers
export const fillLoginForm = async (user, email = 'test@example.com', password = 'password') => {
  const emailInput = screen.getByPlaceholderText('请输入邮箱');
  const passwordInput = screen.getByPlaceholderText('请输入密码');
  
  await user.type(emailInput, email);
  await user.type(passwordInput, password);
};

export const fillRegistrationForm = async (user, userData = {}) => {
  const {
    name = 'Test User',
    email = 'test@example.com',
    password = 'password123',
    confirmPassword = 'password123',
  } = userData;

  const nameInput = screen.getByPlaceholderText('请输入姓名');
  const emailInput = screen.getByPlaceholderText('请输入邮箱');
  const passwordInput = screen.getByPlaceholderText('请输入密码');
  const confirmPasswordInput = screen.getByPlaceholderText('请确认密码');

  await user.type(nameInput, name);
  await user.type(emailInput, email);
  await user.type(passwordInput, password);
  await user.type(confirmPasswordInput, confirmPassword);
};

export const fillTaskForm = async (user, taskData = {}) => {
  const {
    title = 'Test Task',
    description = 'Test Description',
    priority = 'HIGH',
    dueDate = '2024-12-31',
  } = taskData;

  const titleInput = screen.getByPlaceholderText('请输入任务标题');
  const descriptionInput = screen.getByPlaceholderText('请输入任务描述');
  
  await user.type(titleInput, title);
  await user.type(descriptionInput, description);

  if (priority) {
    const prioritySelect = screen.getByRole('combobox', { name: /优先级/ });
    await user.click(prioritySelect);
    await user.click(screen.getByText(priority));
  }

  if (dueDate) {
    const dueDateInput = screen.getByRole('textbox', { name: /截止日期/ });
    await user.type(dueDateInput, dueDate);
  }
};

// Navigation helpers
export const navigateToPage = async (user, pageName) => {
  const pageLink = screen.getByText(pageName);
  await user.click(pageLink);
};

export const switchToTab = async (user, tabName) => {
  const tab = screen.getByText(tabName);
  await user.click(tab);
};

// Assertion helpers
export const expectTaskToBeVisible = (taskTitle) => {
  expect(screen.getByText(taskTitle)).toBeInTheDocument();
};

export const expectTaskNotToBeVisible = (taskTitle) => {
  expect(screen.queryByText(taskTitle)).not.toBeInTheDocument();
};

export const expectErrorToBeVisible = (errorMessage) => {
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
};

export const expectSuccessMessageToBeVisible = (message) => {
  expect(screen.getByText(message)).toBeInTheDocument();
};

// Mock localStorage helpers
export const mockLocalStorage = (data = {}) => {
  const mockStorage = {
    getItem: vi.fn((key) => data[key] || null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });

  return mockStorage;
};

export const mockAuthenticatedUser = (user = createMockUser()) => {
  return mockLocalStorage({
    'access_token': 'test-token',
    'refresh_token': 'test-refresh-token',
    'user': JSON.stringify(user),
  });
};

// Performance testing helpers
export const measureRenderTime = (renderFunction) => {
  const startTime = performance.now();
  const result = renderFunction();
  const endTime = performance.now();
  
  return {
    result,
    renderTime: endTime - startTime,
  };
};

export const measureAsyncOperation = async (asyncFunction) => {
  const startTime = performance.now();
  const result = await asyncFunction();
  const endTime = performance.now();
  
  return {
    result,
    operationTime: endTime - startTime,
  };
};

// Cleanup helpers
export const cleanupMocks = () => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
};

export const resetAllMocks = () => {
  vi.resetAllMocks();
  vi.clearAllTimers();
};

// Export everything
export * from '@testing-library/react';
export { customRender as render };
