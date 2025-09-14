import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Tabs, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TabPane } = Tabs;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 如果用户已经登录，直接跳转到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');

    // 显示登录中的消息
    const loadingMessage = message.loading('正在登录，请稍候...', 0);

    try {
      const result = await login(values);
      loadingMessage();

      if (result.success) {
        message.success('登录成功！欢迎使用任务管理系统');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setError(result.message || '登录失败，请检查邮箱和密码');
        message.error(result.message || '登录失败，请检查邮箱和密码');
      }
    } catch (error) {
      loadingMessage();
      const errorMsg = error.message || '登录失败，请稍后重试';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    setError('');

    // 显示注册中的消息
    const loadingMessage = message.loading('正在注册，请稍候...', 0);

    try {
      const result = await register(values);
      loadingMessage();

      if (result.success) {
        message.success('注册成功！请使用新账户登录');
        setActiveTab('login');
      } else {
        setError(result.message || '注册失败，请稍后重试');
        message.error(result.message || '注册失败，请稍后重试');
      }
    } catch (error) {
      loadingMessage();
      const errorMsg = error.message || '注册失败，请稍后重试';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          任务管理系统
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setError('')}
          />
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="登录" key="login">
            <Form
              onFinish={handleLogin}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效邮箱' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                >
                  登录
                </Button>
              </Form.Item>

              {/* 测试账户提示 */}
              <Alert
                message="测试账户"
                description={
                  <div>
                    <div><strong>管理员：</strong>admin@example.com / password123</div>
                    <div><strong>开发者：</strong>john@example.com / password123</div>
                    <div><strong>测试员：</strong>test@example.com / password123</div>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Form>
          </TabPane>

          <TabPane tab="注册" key="register">
            <Form
              onFinish={handleRegister}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: '用户名只能包含字母、数字和下划线，长度3-20位' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入姓名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效邮箱' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请确认密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;