import { lazy } from 'react';

// 懒加载页面组件
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyTasks = lazy(() => import('../pages/Tasks'));
export const LazyCalendar = lazy(() => import('../pages/Calendar'));
export const LazyQuadrant = lazy(() => import('../pages/Quadrant'));
export const LazyUsers = lazy(() => import('../pages/Users'));
export const LazySystem = lazy(() => import('../pages/System'));
export const LazyProfile = lazy(() => import('../pages/Profile'));

// 懒加载通用组件
export const LazyErrorBoundary = lazy(() => import('./ErrorBoundary'));
