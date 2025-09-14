import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getProfile();
          if (response.success) {
            setUser(response.data);
          } else {
            // 如果获取用户信息失败，清除无效token
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // 发生错误时清除可能无效的token
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.error?.message || '登录失败，请检查邮箱和密码' };
    } catch (error) {
      return { success: false, message: error.message || '登录失败，请稍后重试' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        return { success: true };
      }
      return { success: false, message: response.error?.message || '注册失败，请稍后重试' };
    } catch (error) {
      return { success: false, message: error.message || '注册失败，请稍后重试' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      message.success('已安全退出登录');
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      message.info('已退出登录');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};