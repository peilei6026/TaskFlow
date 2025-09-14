import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  LazyDashboard,
  LazyTasks,
  LazyCalendar,
  LazyQuadrant,
  LazyUsers,
  LazySystem,
  LazyProfile,
  LazyErrorBoundary,
} from '../LazyComponents';

// Mock the page components
vi.mock('../../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard Component</div>,
}));

vi.mock('../../pages/Tasks', () => ({
  default: () => <div data-testid="tasks">Tasks Component</div>,
}));

vi.mock('../../pages/Calendar', () => ({
  default: () => <div data-testid="calendar">Calendar Component</div>,
}));

vi.mock('../../pages/Quadrant', () => ({
  default: () => <div data-testid="quadrant">Quadrant Component</div>,
}));

vi.mock('../../pages/Users', () => ({
  default: () => <div data-testid="users">Users Component</div>,
}));

vi.mock('../../pages/System', () => ({
  default: () => <div data-testid="system">System Component</div>,
}));

vi.mock('../../pages/Profile', () => ({
  default: () => <div data-testid="profile">Profile Component</div>,
}));

vi.mock('../ErrorBoundary', () => ({
  default: () => <div data-testid="error-boundary">ErrorBoundary Component</div>,
}));

const LoadingFallback = () => <div data-testid="loading">Loading...</div>;

describe('LazyComponents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LazyDashboard', () => {
    it('should render Dashboard component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazyDashboard />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('LazyTasks', () => {
    it('should render Tasks component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazyTasks />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('tasks')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('LazyCalendar', () => {
    it('should render Calendar component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazyCalendar />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('LazyQuadrant', () => {
    it('should render Quadrant component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazyQuadrant />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('quadrant')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('LazyUsers', () => {
    it('should render Users component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazyUsers />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('users')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('LazySystem', () => {
    it('should render System component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazySystem />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('system')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('LazyProfile', () => {
    it('should render Profile component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazyProfile />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('LazyErrorBoundary', () => {
    it('should render ErrorBoundary component when loaded', async () => {
      render(
        <Suspense fallback={<LoadingFallback />}>
          <LazyErrorBoundary />
        </Suspense>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle component loading errors', async () => {
      // Mock a component that throws an error
      vi.doMock('../../pages/Dashboard', () => ({
        default: () => {
          throw new Error('Loading error');
        },
      }));

      const { LazyDashboard: ErrorLazyDashboard } = await import('../LazyComponents');

      render(
        <Suspense fallback={<LoadingFallback />}>
          <ErrorLazyDashboard />
        </Suspense>
      );

      // Should show loading initially
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Should eventually show error (this depends on error boundary implementation)
      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });
    });
  });
});
