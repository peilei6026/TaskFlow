import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';

const { Title } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const response = await userService.updateProfile(values);
      if (response.success) {
        message.success('个人信息更新成功');
      } else {
        message.error(response.error?.message || '更新失败，请稍后重试');
      }
    } catch (error) {
      message.error('更新失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      const response = await userService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      if (response.success) {
        message.success('密码修改成功，2秒后将自动退出登录');
        passwordForm.resetFields();
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        message.error(response.error?.message || '密码修改失败，请检查原密码是否正确');
      }
    } catch (error) {
      message.error('密码修改失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>个人设置</Title>

      <Card>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="基本信息" key="profile">
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={{
                name: user?.name,
                email: user?.email
              }}
            >
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

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  更新信息
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <div style={{ padding: '16px 0' }}>
              <Title level={4}>账户信息</Title>
              <div style={{ marginBottom: 8 }}>
                <strong>角色：</strong>
                <span style={{ marginLeft: 8 }}>
                  {user?.role === 'ADMIN' ? '管理员' : '普通用户'}
                </span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>注册时间：</strong>
                <span style={{ marginLeft: 8 }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleString() : '未知'}
                </span>
              </div>
              <div>
                <strong>最后登录：</strong>
                <span style={{ marginLeft: 8 }}>
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '首次登录'}
                </span>
              </div>
            </div>
          </TabPane>

          <TabPane tab="修改密码" key="password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="oldPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入当前密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码至少6位' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入新密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请确认新密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;