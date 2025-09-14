import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: '/tasks',
      icon: <ProjectOutlined />,
      label: '任务管理',
    },
    // {
    //   key: '/calendar',
    //   icon: <CalendarOutlined />,
    //   label: '日历管理',
    // },
    // {
    //   key: '/quadrant',
    //   icon: <BarChartOutlined />,
    //   label: '四象限分析',
    // },
    ...(user?.role === 'ADMIN' ? [{
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    }, {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
    }] : [])
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="sidebar-logo">
          {collapsed ? 'TMS' : '任务管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            border: 'none'
          }}
        />
      </Sider>
      <Layout style={{ background: 'transparent' }}>
        <Header style={{
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
          border: 'none',
          borderRadius: '0 0 16px 16px'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#667eea'
            }}
          />

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
          >
            <div className="user-dropdown">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{
                  marginRight: 8,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              <span style={{ color: '#333', fontWeight: 500 }}>{user?.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{
          margin: '24px',
          padding: '32px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: 'calc(100vh - 200px)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;