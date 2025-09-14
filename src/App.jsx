import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import Quadrant from './pages/Quadrant';
import System from './pages/System';
import config from './config';
import './App.css';

// 条件性加载Mock数据（仅在开发环境且配置启用时）
if (import.meta.env.DEV && config.development.useMock) {
  import('./mock');
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                } />
                <Route path="/tasks" element={
                  <ErrorBoundary>
                    <Tasks />
                  </ErrorBoundary>
                } />
                <Route path="/calendar" element={
                  <ErrorBoundary>
                    <Calendar />
                  </ErrorBoundary>
                } />
                <Route path="/quadrant" element={
                  <ErrorBoundary>
                    <Quadrant />
                  </ErrorBoundary>
                } />
                <Route path="/profile" element={
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                } />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary>
                        <Users />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/system"
                  element={
                    <ProtectedRoute adminOnly>
                      <ErrorBoundary>
                        <System />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <Router>
          <AuthProvider>
            <TaskProvider>
              <AppRoutes />
            </TaskProvider>
          </AuthProvider>
        </Router>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;