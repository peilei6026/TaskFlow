import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Tag, Progress, Typography, Tabs, Button } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  AppstoreOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useTask } from '../context/TaskContext';
import taskService from '../services/taskService';
import timeEntryService from '../services/timeEntryService';
import FourQuadrant from '../components/FourQuadrant';

const { Title } = Typography;

const Dashboard = () => {
  const { user } = useAuth();
  const {
    fetchTasks,
    getUserTasks,
    getTaskStats,
    categorizeTasksToQuadrants,
    refreshTrigger
  } = useTask();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentTasks, setRecentTasks] = useState([]);
  const [timeStats, setTimeStats] = useState({});
  const [quadrantData, setQuadrantData] = useState({
    urgent_important: [],
    urgent_not_important: [],
    not_urgent_important: [],
    not_urgent_not_important: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 获取任务数据
        await fetchTasks();

        // 获取用户任务
        const userTasks = getUserTasks(user.id);
        setRecentTasks(userTasks.slice(0, 5));

        // 获取统计数据
        const userStats = await getTaskStats(user.id);
        setStats(userStats);

        // 获取四象限数据
        const quadrants = categorizeTasksToQuadrants(user.id);
        setQuadrantData(quadrants);

        // 获取时间统计 - 只在初次加载或用户切换时调用
        const timeResponse = await timeEntryService.getTimeStats({ userId: user.id });
        if (timeResponse && timeResponse.success && timeResponse.data) {
          setTimeStats(timeResponse.data);
        } else {
          setTimeStats({});
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setRecentTasks([]);
        setStats({ total: 0, completed: 0, inProgress: 0, todo: 0, completionRate: 0 });
        setTimeStats({});
        setQuadrantData({
          urgent_important: [],
          urgent_not_important: [],
          not_urgent_important: [],
          not_urgent_not_important: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user.id, refreshTrigger]);

  const getPriorityColor = (priority) => {
    switch (priority) {
         case 'HIGH':
        return 'red';
      case 'MEDIUM':
        return 'orange';
      case 'LOW':
        return 'green';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
       case 'HIGH':
        return '高';
      case 'MEDIUM':
        return '中';
      case 'LOW':
        return '低';
      default:
        return '未设置';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in_progress':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    }
  };

  const tabItems = [
    {
      key: '1',
      label: '概览',
      icon: <BarChartOutlined />,
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总任务数"
                  value={stats.total || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="已完成"
                  value={stats.completed || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="进行中"
                  value={stats.inProgress || 0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="待开始"
                  value={stats.todo || 0}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                title="我的最新任务"
                extra={
                  <Button type="link" onClick={() => window.location.href = '/tasks'}>
                    查看全部
                  </Button>
                }
                loading={loading}
              >
                <List
                  dataSource={recentTasks}
                  renderItem={(task) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={getStatusIcon(task.status)}
                        title={
                          <div>
                            <span style={{ marginRight: 8 }}>{task.title}</span>
                            <Tag color={getPriorityColor(task.priority)}>
                              {getPriorityText(task.priority)}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: 4 }}>{task.description}</div>
                            {task.dueDate && (
                              <span style={{ color: '#666', fontSize: '12px' }}>
                                截止日期: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: '暂无任务' }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="任务完成率" loading={loading}>
                <Progress
                  type="circle"
                  percent={stats.completionRate || 0}
                  format={(percent) => `${percent}%`}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
                  已完成 {stats.completed || 0} / {stats.total || 0} 个任务
                </div>
              </Card>

              {(timeStats.totalHours || Object.keys(timeStats).length > 0) && (
                <Card title="本月工时统计" style={{ marginTop: 16 }}>
                  <Statistic
                    title="总工时"
                    value={timeStats.totalHours}
                    suffix="小时"
                    precision={1}
                    valueStyle={{
                      color: timeStats.efficiency > 85 ? '#52c41a' :
                             timeStats.efficiency > 75 ? '#faad14' : '#f5222d'
                    }}
                  />
                  <div style={{ marginTop: 12 }}>
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: 4 }}>
                      平均每日: {timeStats.averageHoursPerDay || (timeStats.totalHours / 20).toFixed(1)} 小时
                    </div>
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: 4 }}>
                      工作天数: {timeStats.daysWorked || 20} 天
                    </div>
                    {timeStats.efficiency && (
                      <div style={{
                        color: timeStats.efficiency > 85 ? '#52c41a' :
                               timeStats.efficiency > 75 ? '#faad14' : '#f5222d',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        工作效率: {timeStats.efficiency}%
                      </div>
                    )}
                    {timeStats.topTask && (
                      <div style={{ color: '#666', fontSize: '11px', marginTop: 8 }}>
                        主要任务: {timeStats.topTask} ({timeStats.topTaskHours}h)
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: '2',
      label: '四象限管理',
      icon: <AppstoreOutlined />,
      children: <FourQuadrant initialItems={quadrantData} />
    }
  ];

  return (
    <div>
      <Title level={2}>工作台</Title>
      <div style={{ marginBottom: 24 }}>
        <span style={{ color: '#666' }}>欢迎回来，{user?.name}！</span>
      </div>

      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default Dashboard;