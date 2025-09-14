import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePerformance, useMemoryMonitor, useNetworkStatus } from '../usePerformance';

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

// Mock navigator
const mockNavigator = {
  onLine: true,
  connection: {
    effectiveType: '4g',
  },
};

Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
});

Object.defineProperty(navigator, 'connection', {
  value: mockNavigator.connection,
  writable: true,
});

describe('usePerformance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should track render count and time', () => {
    const componentName = 'TestComponent';
    const { result, rerender } = renderHook(() => usePerformance(componentName));

    expect(result.current.renderCount).toBe(1);

    // Rerender to increment count
    rerender();
    expect(result.current.renderCount).toBe(2);

    rerender();
    expect(result.current.renderCount).toBe(3);
  });

  it('should log performance data in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const componentName = 'TestComponent';
    renderHook(() => usePerformance(componentName));

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[Performance] TestComponent:'),
      expect.objectContaining({
        renderCount: 1,
        renderTime: expect.any(String),
        timestamp: expect.any(String),
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should not log in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const componentName = 'TestComponent';
    renderHook(() => usePerformance(componentName));

    expect(console.log).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should warn about slow renders', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // Mock slow performance
    let callCount = 0;
    mockPerformance.now.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? 0 : 150; // 150ms render time
    });

    const componentName = 'SlowComponent';
    renderHook(() => usePerformance(componentName));

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[Performance Warning] SlowComponent took 150.00ms to render')
    );

    process.env.NODE_ENV = originalEnv;
  });
});

describe('useMemoryMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should monitor memory usage in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    renderHook(() => useMemoryMonitor());

    // Fast forward to trigger memory check
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    // Should not warn with current memory usage (25%)
    expect(console.warn).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should warn about high memory usage', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // Mock high memory usage (90% of limit)
    mockPerformance.memory.usedJSHeapSize = 180 * 1024 * 1024; // 180MB
    mockPerformance.memory.jsHeapSizeLimit = 200 * 1024 * 1024; // 200MB

    renderHook(() => useMemoryMonitor());

    // Fast forward to trigger memory check
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(console.warn).toHaveBeenCalledWith(
      '[Memory Warning] High memory usage:',
      expect.objectContaining({
        used: '180.00MB',
        total: '100.00MB',
        limit: '200.00MB',
        usage: '90.0%',
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should not monitor in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    renderHook(() => useMemoryMonitor());

    // Fast forward to trigger memory check
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(console.warn).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });
});

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial online status', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.connectionType).toBe('4g');
  });

  it('should update online status when navigator.onLine changes', () => {
    const { result, rerender } = renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(true);

    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    // Trigger re-render
    rerender();

    expect(result.current.isOnline).toBe(false);
  });

  it('should handle missing connection API', () => {
    // Mock navigator without connection
    const originalConnection = navigator.connection;
    Object.defineProperty(navigator, 'connection', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.connectionType).toBe('unknown');

    // Restore original connection
    Object.defineProperty(navigator, 'connection', {
      value: originalConnection,
      writable: true,
    });
  });
});
