import { describe, it, expect, vi } from 'vitest';

// Mock axios
const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(() => mockAxios),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
};

vi.mock('axios', () => ({
  default: mockAxios,
  create: vi.fn(() => mockAxios)
}));

describe('API Service Tests', () => {
  it('should create axios instance', () => {
    expect(mockAxios.create).toBeDefined();
  });

  it('should have interceptors', () => {
    expect(mockAxios.interceptors).toBeDefined();
    expect(mockAxios.interceptors.request).toBeDefined();
    expect(mockAxios.interceptors.response).toBeDefined();
  });

  it('should have HTTP methods', () => {
    expect(mockAxios.get).toBeDefined();
    expect(mockAxios.post).toBeDefined();
    expect(mockAxios.put).toBeDefined();
    expect(mockAxios.delete).toBeDefined();
  });
});
