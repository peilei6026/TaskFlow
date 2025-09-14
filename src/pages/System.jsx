import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Tabs,
  Form,
  Input,
  Switch,
  Select,
  Button,
  Statistic,
  Progress,
  Table,
  message,
  Modal,
  Space,
  Tag
} from 'antd';
import {
  SettingOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  SecurityScanOutlined,
  BellOutlined,
  GlobalOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import systemService from '../services/systemService';
import { useAuth } from '../hooks/useAuth';

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

const System = () => {
  const [settings, setSettings] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchSettings();
      fetchStats();
    }
  }, [user]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await systemService.getSettings();
      if (response.success) {
        setSettings(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      message.error('获取系统设置失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await systemService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      message.error('获取系统统计失败');
    }
  };

  const handleSaveSettings = async (values) => {
    setSaveLoading(true);
    try {
      const response = await systemService.updateSettings(values);
      if (response.success) {
        message.success('设置保存成功');
        setSettings(response.data);
      }
    } catch (error) {
      message.error('设置保存失败');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBackup = () => {
    confirm({
      title: '确认执行系统备份？',
      icon: <ExclamationCircleOutlined />,
      content: '系统备份可能需要几分钟时间，确认继续？',
      onOk: async () => {
        setBackupLoading(true);
        try {
          const response = await systemService.backup();
          if (response.success) {
            message.success(`备份成功：${response.data.filename}`);
            fetchSettings();
          }
        } catch (error) {
          message.error('备份失败');
        } finally {
          setBackupLoading(false);
        }
      }
    });
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <SecurityScanOutlined style={{ fontSize: '48px', color: '#999', marginBottom: 16 }} />
          <h3>权限不足</h3>
          <p>只有系统管理员可以访问系统管理页面</p>
        </div>
      </Card>
    );
  }

  const systemLogsData = [
    {
      key: '1',
      timestamp: '2025-09-13 10:30:25',
      level: 'INFO',
      action: '用户登录',
      user: 'admin',
      ip: '192.168.1.100',
      details: '管理员用户登录成功'
    },
    {
      key: '2',
      timestamp: '2025-09-13 10:25:12',
      level: 'WARN',
      action: '任务更新',
      user: 'user1',
      ip: '192.168.1.101',
      details: '任务状态更新为已完成'
    },
    {
      key: '3',
      timestamp: '2025-09-13 10:20:08',
      level: 'ERROR',
      action: '登录失败',
      user: 'unknown',
      ip: '192.168.1.102',
      details: '密码错误，登录失败'
    }
  ];

  const logColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => {
        const colors = {
          'INFO': 'blue',
          'WARN': 'orange',
          'ERROR': 'red'
        };
        return <Tag color={colors[level]}>{level}</Tag>;
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 100
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120
    },
    {
      title: '详细信息',
      dataIndex: 'details',
      key: 'details'
    }
  ];

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SettingOutlined style={{ marginRight: 8 }} />
            系统管理
          </div>
        }
      >
        <Tabs defaultActiveKey="overview">
          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                系统概览
              </span>
            }
            key="overview"
          >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="用户总数"
                    value={stats.users?.total || 0}
                    prefix={<GlobalOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: '#52c41a' }}>活跃: {stats.users?.active || 0}</span>
                    <span style={{ color: '#999', marginLeft: 16 }}>
                      非活跃: {stats.users?.inactive || 0}
                    </span>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="任务总数"
                    value={stats.tasks?.total || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Progress
                      percent={stats.tasks?.completionRate || 0}
                      size="small"
                      status="active"
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="日历事件"
                    value={stats.events?.total || 0}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: '#666' }}>
                      本周: {stats.events?.thisWeek || 0} 个
                    </span>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="存储使用"
                    value={stats.storage?.usage || 0}
                    suffix="%"
                    valueStyle={{ color: '#f5222d' }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: '#666' }}>
                      {stats.storage?.used || '0MB'} / {stats.storage?.total || '100MB'}
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>

            <Card title="系统日志" size="small">
              <Table
                columns={logColumns}
                dataSource={systemLogsData}
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <GlobalOutlined />
                基本设置
              </span>
            }
            key="general"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveSettings}
              initialValues={settings.general}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['general', 'siteName']}
                    label="站点名称"
                  >
                    <Input placeholder="请输入站点名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['general', 'timezone']}
                    label="时区"
                  >
                    <Select placeholder="请选择时区">
                      <Option value="Asia/Shanghai">Asia/Shanghai</Option>
                      <Option value="UTC">UTC</Option>
                      <Option value="America/New_York">America/New_York</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name={['general', 'siteDescription']}
                label="站点描述"
              >
                <Input.TextArea rows={3} placeholder="请输入站点描述" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['general', 'language']}
                    label="系统语言"
                  >
                    <Select placeholder="请选择语言">
                      <Option value="zh-CN">简体中文</Option>
                      <Option value="en-US">English</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['general', 'dateFormat']}
                    label="日期格式"
                  >
                    <Select placeholder="请选择日期格式">
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={saveLoading}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                通知设置
              </span>
            }
            key="notification"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveSettings}
              initialValues={settings.notification}
            >
              <Card title="通知渠道" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['notification', 'emailEnabled']}
                      label="邮件通知"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['notification', 'smsEnabled']}
                      label="短信通知"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['notification', 'pushEnabled']}
                      label="推送通知"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="通知内容" size="small">
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['notification', 'taskReminder']}
                      label="任务提醒"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['notification', 'deadlineAlert']}
                      label="截止日期提醒"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['notification', 'weeklyReport']}
                      label="周报提醒"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={saveLoading}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SecurityScanOutlined />
                安全设置
              </span>
            }
            key="security"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveSettings}
              initialValues={settings.security}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['security', 'passwordMinLength']}
                    label="密码最小长度"
                  >
                    <Select>
                      <Option value={6}>6位</Option>
                      <Option value={8}>8位</Option>
                      <Option value={10}>10位</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['security', 'sessionTimeout']}
                    label="会话超时（小时）"
                  >
                    <Select>
                      <Option value={1}>1小时</Option>
                      <Option value={8}>8小时</Option>
                      <Option value={24}>24小时</Option>
                      <Option value={168}>7天</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['security', 'maxLoginAttempts']}
                    label="最大登录尝试次数"
                  >
                    <Select>
                      <Option value={3}>3次</Option>
                      <Option value={5}>5次</Option>
                      <Option value={10}>10次</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['security', 'twoFactorAuth']}
                    label="双因子认证"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name={['security', 'passwordComplexity']}
                label="密码复杂度要求"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={saveLoading}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <DatabaseOutlined />
                数据备份
              </span>
            }
            key="backup"
          >
            <Card title="备份设置" size="small" style={{ marginBottom: 16 }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveSettings}
                initialValues={settings.backup}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['backup', 'autoBackup']}
                      label="自动备份"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['backup', 'backupFrequency']}
                      label="备份频率"
                    >
                      <Select>
                        <Option value="daily">每日</Option>
                        <Option value="weekly">每周</Option>
                        <Option value="monthly">每月</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name={['backup', 'retentionDays']}
                  label="备份保留天数"
                >
                  <Select>
                    <Option value={7}>7天</Option>
                    <Option value={30}>30天</Option>
                    <Option value={90}>90天</Option>
                    <Option value={365}>365天</Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={saveLoading}>
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card title="手动备份" size="small">
              <div style={{ marginBottom: 16 }}>
                <p>上次备份时间: {settings.backup?.lastBackup ?
                  new Date(settings.backup.lastBackup).toLocaleString() : '从未备份'}</p>
              </div>
              <Space>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleBackup}
                  loading={backupLoading}
                >
                  立即备份
                </Button>
                <Button disabled>
                  恢复备份
                </Button>
              </Space>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default System;