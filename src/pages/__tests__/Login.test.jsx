import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock useAuth hook
const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const LoginWrapper = () => (
  <BrowserRouter>
    <Login />
  </BrowserRouter>
);

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<LoginWrapper />);

    expect(screen.getByText('任务管理系统')).toBeInTheDocument();
    // 使用更具体的查询方式，避免多个元素的问题
    const emailInputs = screen.getAllByPlaceholderText('请输入邮箱');
    const passwordInputs = screen.getAllByPlaceholderText('请输入密码');
    expect(emailInputs.length).toBeGreaterThan(0);
    expect(passwordInputs.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  it('switches to register form when clicking register tab', async () => {
    const user = userEvent.setup();

    render(<LoginWrapper />);

    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    expect(screen.getByPlaceholderText('请输入姓名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请确认密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();

    render(<LoginWrapper />);

    // 获取登录表单中的邮箱输入框（第一个）
    const emailInputs = screen.getAllByPlaceholderText('请输入邮箱');
    const emailInput = emailInputs[0]; // 使用登录表单的邮箱输入框
    const loginButton = screen.getByRole('button', { name: '登录' });

    await user.type(emailInput, 'invalid-email');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('请输入有效邮箱')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(<LoginWrapper />);

    const loginButton = screen.getByRole('button', { name: '登录' });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('请输入邮箱')).toBeInTheDocument();
      expect(screen.getByText('请输入密码')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue({
      success: true,
      user: { name: 'Test User' },
    });

    render(<LoginWrapper />);

    // 获取登录表单中的输入框
    const emailInputs = screen.getAllByPlaceholderText('请输入邮箱');
    const passwordInputs = screen.getAllByPlaceholderText('请输入密码');
    const emailInput = emailInputs[0]; // 使用登录表单的邮箱输入框
    const passwordInput = passwordInputs[0]; // 使用登录表单的密码输入框
    const loginButton = screen.getByRole('button', { name: '登录' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    // Should navigate to dashboard after successful login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 1000 });
  });

  it('handles login failure', async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue({
      success: false,
      message: '用户名或密码错误',
    });

    render(<LoginWrapper />);

    // 获取登录表单中的输入框
    const emailInputs = screen.getAllByPlaceholderText('请输入邮箱');
    const passwordInputs = screen.getAllByPlaceholderText('请输入密码');
    const emailInput = emailInputs[0]; // 使用登录表单的邮箱输入框
    const passwordInput = passwordInputs[0]; // 使用登录表单的密码输入框
    const loginButton = screen.getByRole('button', { name: '登录' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('用户名或密码错误')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles registration with password confirmation', async () => {
    const user = userEvent.setup();

    mockRegister.mockResolvedValue({
      success: true,
    });

    render(<LoginWrapper />);

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

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  it('validates password confirmation match', async () => {
    const user = userEvent.setup();

    render(<LoginWrapper />);

    // Switch to register tab
    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    // Fill form with mismatched passwords
    const nameInput = screen.getByPlaceholderText('请输入姓名');
    const emailInput = screen.getByPlaceholderText('请输入邮箱');
    const passwordInput = screen.getByPlaceholderText('请输入密码');
    const confirmPasswordInput = screen.getByPlaceholderText('请确认密码');
    const registerButton = screen.getByRole('button', { name: '注册' });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('两次输入密码不一致')).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates password minimum length', async () => {
    const user = userEvent.setup();

    render(<LoginWrapper />);

    // Switch to register tab
    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    const passwordInput = screen.getByPlaceholderText('请输入密码');
    const registerButton = screen.getByRole('button', { name: '注册' });

    await user.type(passwordInput, '123');
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('密码至少6位')).toBeInTheDocument();
    });
  });

  it('shows test account information', () => {
    render(<LoginWrapper />);

    expect(screen.getByText('测试账户')).toBeInTheDocument();
    // 使用更宽松的匹配方式
    expect(screen.getByText(/admin@example\.com.*password/)).toBeInTheDocument();
    expect(screen.getByText(/user@example\.com.*password/)).toBeInTheDocument();
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();

    // Mock login to return a promise that we can control
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValue(loginPromise);

    render(<LoginWrapper />);

    // 获取登录表单中的输入框
    const emailInputs = screen.getAllByPlaceholderText('请输入邮箱');
    const passwordInputs = screen.getAllByPlaceholderText('请输入密码');
    const emailInput = emailInputs[0]; // 使用登录表单的邮箱输入框
    const passwordInput = passwordInputs[0]; // 使用登录表单的密码输入框
    const loginButton = screen.getByRole('button', { name: '登录' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');
    await user.click(loginButton);

    // Check that button shows loading state
    expect(loginButton).toHaveAttribute('disabled');

    // Resolve the login promise
    resolveLogin({ success: true });
  });

  it('clears error when switching tabs', async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue({
      success: false,
      message: 'Login error',
    });

    render(<LoginWrapper />);

    // Cause login error
    const loginButton = screen.getByRole('button', { name: '登录' });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Login error')).toBeInTheDocument();
    });

    // Switch to register tab
    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    // Error should be cleared
    expect(screen.queryByText('Login error')).not.toBeInTheDocument();
  });
});