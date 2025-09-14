// Test configuration and setup
import { vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.REACT_APP_API_URL = 'http://localhost:3002/api';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore console.log in tests
  // log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 50 * 1024 * 1024, // 50MB
      totalJSHeapSize: 100 * 1024 * 1024, // 100MB
      jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB
    },
  },
  writable: true,
});

// Mock navigator
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

// Mock history
window.history = {
  pushState: vi.fn(),
  replaceState: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

// Test timeout configuration
export const TEST_TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 5000,
  LONG: 10000,
  VERY_LONG: 30000,
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  PAGE_LOAD: 1000, // 1 second
  COMPONENT_RENDER: 100, // 100ms
  API_RESPONSE: 2000, // 2 seconds
  USER_INTERACTION: 50, // 50ms
  MEMORY_USAGE: 0.8, // 80% of limit
};

// Test data constants
export const TEST_DATA = {
  USERS: {
    ADMIN: {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    },
    USER: {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      role: 'USER',
    },
  },
  TASKS: {
    TODO: {
      id: 1,
      title: 'Todo Task',
      status: 'TODO',
      priority: 'HIGH',
    },
    IN_PROGRESS: {
      id: 2,
      title: 'In Progress Task',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
    },
    COMPLETED: {
      id: 3,
      title: 'Completed Task',
      status: 'COMPLETED',
      priority: 'LOW',
    },
  },
  EVENTS: {
    MEETING: {
      id: 1,
      title: 'Team Meeting',
      type: 'MEETING',
      startTime: '2024-01-01T09:00:00Z',
      endTime: '2024-01-01T10:00:00Z',
    },
    DEADLINE: {
      id: 2,
      title: 'Project Deadline',
      type: 'DEADLINE',
      startTime: '2024-01-31T17:00:00Z',
      endTime: '2024-01-31T17:00:00Z',
    },
  },
};

// Mock service responses
export const MOCK_RESPONSES = {
  SUCCESS: {
    success: true,
    data: {},
    message: 'Success',
  },
  ERROR: {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An error occurred',
    },
  },
  VALIDATION_ERROR: {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
    },
  },
  UNAUTHORIZED: {
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Unauthorized access',
    },
  },
  NOT_FOUND: {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  },
};

// Test utilities
export const createMockPromise = (resolveValue, rejectValue = null) => {
  return new Promise((resolve, reject) => {
    if (rejectValue) {
      reject(rejectValue);
    } else {
      resolve(resolveValue);
    }
  });
};

export const createMockAsyncFunction = (returnValue, delay = 0) => {
  return vi.fn(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(returnValue), delay);
    });
  });
};

export const createMockError = (message = 'Test error', code = 'TEST_ERROR') => {
  const error = new Error(message);
  error.code = code;
  return error;
};

// Cleanup function
export const cleanup = () => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
  vi.clearAllTimers();
};

// Setup function
export const setup = () => {
  cleanup();
  vi.useFakeTimers();
};

// Teardown function
export const teardown = () => {
  cleanup();
  vi.useRealTimers();
};

export default {
  TEST_TIMEOUTS,
  PERFORMANCE_THRESHOLDS,
  TEST_DATA,
  MOCK_RESPONSES,
  createMockPromise,
  createMockAsyncFunction,
  createMockError,
  cleanup,
  setup,
  teardown,
};
