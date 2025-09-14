import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, List, Tag, Button, Typography, message, Spin, Modal, Tooltip } from 'antd';
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  InboxOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import quadrantService from '../services/quadrantService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Quadrant = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState({
    urgent_important: [],
    important_not_urgent: [],
    urgent_not_important: [],
    not_urgent_not_important: [],
    archived: []
  });
  const [loading, setLoading] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedModalVisible, setArchivedModalVisible] = useState(false);
  const [dragInProgress, setDragInProgress] = useState(false);

  const quadrantConfig = {
    urgent_important: {
      title: '重要且紧急',
      subtitle: '立即执行',
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      description: '需要立即处理的紧急任务'
    },
    important_not_urgent: {
      title: '重要但不紧急',
      subtitle: '计划执行',
      icon: <ClockCircleOutlined />,
      color: '#fa8c16',
      description: '重要的长期目标和规划'
    },
    urgent_not_important: {
      title: '紧急但不重要',
      subtitle: '委托执行',
      icon: <InfoCircleOutlined />,
      color: '#1890ff',
      description: '可以委托他人处理的任务'
    },
    not_urgent_not_important: {
      title: '不紧急且不重要',
      subtitle: '减少执行',
      icon: <MinusCircleOutlined />,
      color: '#52c41a',
      description: '应该减少或避免的活动'
    },
    archived: {
      title: '已归档',
      subtitle: '已完成或暂停',
      icon: <InboxOutlined />,
      color: '#8c8c8c',
      description: '已完成的任务或暂时搁置的项目'
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await quadrantService.getAnalysis();
      if (response && response.success && response.data) {
        const data = {
          urgent_important: Array.isArray(response.data.urgent_important) ? response.data.urgent_important : [],
          important_not_urgent: Array.isArray(response.data.important_not_urgent) ? response.data.important_not_urgent : [],
          urgent_not_important: Array.isArray(response.data.urgent_not_important) ? response.data.urgent_not_important : [],
          not_urgent_not_important: Array.isArray(response.data.not_urgent_not_important) ? response.data.not_urgent_not_important : [],
          archived: Array.isArray(response.data.archived) ? response.data.archived : []
        };
        setAnalysis(data);
      } else {
        console.warn('Invalid quadrant analysis response:', response);
        setAnalysis({
          urgent_important: [],
          important_not_urgent: [],
          urgent_not_important: [],
          not_urgent_not_important: [],
          archived: []
        });
        message.warning('数据格式异常，请稍后重试');
      }
    } catch (error) {
      console.error('Failed to fetch quadrant analysis:', error);
      setAnalysis({
        urgent_important: [],
        important_not_urgent: [],
        urgent_not_important: [],
        not_urgent_not_important: [],
        archived: []
      });
      message.error('获取四象限分析失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (start) => {
    setDragInProgress(true);
  };

  const handleDragEnd = async (result) => {
    setDragInProgress(false);
    if (!result.destination) {
      return;
    }

    const sourceQuadrant = result.source.droppableId;
    const destQuadrant = result.destination.droppableId;

    if (sourceQuadrant === destQuadrant) return;

    const taskId = parseInt(result.draggableId);

    try {
      if (destQuadrant === 'archived') {
        const response = await quadrantService.archiveTask(taskId);
        if (response.success) {
          message.success('任务已归档');
          fetchAnalysis();
        }
      } else if (sourceQuadrant === 'archived') {
        const response = await quadrantService.unarchiveTask(taskId, destQuadrant);
        if (response.success) {
          message.success('任务已取消归档');
          fetchAnalysis();
        }
      } else {
        const response = await quadrantService.moveTask(taskId, destQuadrant);
        if (response.success) {
          message.success('任务移动成功');
          fetchAnalysis();
        }
      }
    } catch (error) {
      message.error(destQuadrant === 'archived' ? '归档失败' : '任务移动失败');
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      const response = await quadrantService.archiveTask(taskId);
      if (response.success) {
        message.success('任务已归档');
        fetchAnalysis();
      } else {
        message.error(response.error?.message || '归档失败');
      }
    } catch (error) {
      message.error('归档失败，请稍后重试');
    }
  };

  const handleUnarchiveTask = async (taskId, targetQuadrant = 'not_urgent_not_important') => {
    try {
      const response = await quadrantService.unarchiveTask(taskId, targetQuadrant);
      if (response.success) {
        message.success('任务已恢复');
        fetchAnalysis();
      } else {
        message.error(response.error?.message || '恢复失败');
      }
    } catch (error) {
      message.error('恢复失败，请稍后重试');
    }
  };

  const handleDeleteArchivedTask = async (taskId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要永久删除这个已归档的任务吗？此操作无法撤销。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await quadrantService.deleteArchivedTask(taskId);
          if (response.success) {
            message.success('任务已永久删除');
            fetchAnalysis();
          } else {
            message.error(response.error?.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败，请稍后重试');
        }
      }
    });
  };

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

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return dayjs(dueDate).isBefore(dayjs(), 'day');
  };

  const renderTaskList = (tasks, quadrantKey) => {
    const config = quadrantConfig[quadrantKey];
    const isArchived = quadrantKey === 'archived';

    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: config.color, marginRight: 8 }}>
              {config.icon}
            </span>
            <div>
              <Title level={5} style={{ margin: 0, color: config.color }}>
                {config.title}
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {config.subtitle} • {tasks.length} 个任务
              </Text>
            </div>
          </div>
        }
        extra={
          <div style={{ fontSize: '12px', color: '#999' }}>
            {config.description}
          </div>
        }
        style={{
          height: isArchived ? '350px' : '400px',
          borderTop: `4px solid ${config.color}`
        }}
        bodyStyle={{
          padding: '12px',
          height: isArchived ? 'calc(100% - 70px)' : 'calc(100% - 70px)',
          overflow: 'auto'
        }}
      >
        <Droppable droppableId={quadrantKey}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: '300px',
                backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
                borderRadius: '8px',
                padding: '8px',
                border: snapshot.isDraggingOver ? '2px dashed #1890ff' : '2px dashed transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: snapshot.isDraggingOver ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <List
                size="small"
                dataSource={tasks}
                renderItem={(task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: '8px',
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(5deg)`
                            : provided.draggableProps.style?.transform,
                          transition: snapshot.isDragging ? 'all 0.3s cubic-bezier(0.2, 0, 0.1, 1)' : 'all 0.2s ease',
                          zIndex: snapshot.isDragging ? 1000 : 'auto',
                        }}
                      >
                        <List.Item
                          style={{
                            padding: '12px',
                            border: snapshot.isDragging ? '2px solid #1890ff' : '1px solid #f0f0f0',
                            borderRadius: '8px',
                            backgroundColor: snapshot.isDragging ? '#fff' : isArchived ? '#f5f5f5' : '#fafafa',
                            cursor: 'move',
                            boxShadow: snapshot.isDragging
                              ? '0 8px 24px rgba(24, 144, 255, 0.3), 0 4px 12px rgba(0,0,0,0.15)'
                              : '0 1px 3px rgba(0,0,0,0.1)',
                            opacity: snapshot.isDragging ? 0.9 : isArchived ? 0.8 : 1,
                            scale: snapshot.isDragging ? '1.03' : '1',
                            transition: snapshot.isDragging ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          actions={
                            isArchived ? [
                              <Tooltip title="恢复任务">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<ReloadOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnarchiveTask(task.id);
                                  }}
                                />
                              </Tooltip>,
                              <Tooltip title="永久删除">
                                <Button
                                  type="text"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteArchivedTask(task.id);
                                  }}
                                />
                              </Tooltip>
                            ] : [
                              <Tooltip title="归档任务">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<InboxOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleArchiveTask(task.id);
                                  }}
                                />
                              </Tooltip>
                            ]
                          }
                        >
                          <List.Item.Meta
                            title={
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: isArchived ? 'line-through' : 'none',
                                    color: isArchived ? '#999' : 'inherit'
                                  }}
                                >
                                  {task.title}
                                </span>
                                <Tag color={getPriorityColor(task.priority)} size="small">
                                  {getPriorityText(task.priority)}
                                </Tag>
                                {isOverdue(task.dueDate) && !isArchived && (
                                  <Tag color="red" size="small">逾期</Tag>
                                )}
                                {isArchived && (
                                  <Tag color="default" size="small">已归档</Tag>
                                )}
                              </div>
                            }
                            description={
                              <div>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: isArchived ? '#bbb' : '#666',
                                    marginBottom: '4px'
                                  }}
                                >
                                  {task.description}
                                </div>
                                {task.dueDate && (
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: isArchived ? '#bbb' : isOverdue(task.dueDate) ? '#ff4d4f' : '#999'
                                    }}
                                  >
                                    截止: {dayjs(task.dueDate).format('MM-DD HH:mm')}
                                  </div>
                                )}
                                {isArchived && task.archivedAt && (
                                  <div style={{ fontSize: '12px', color: '#bbb' }}>
                                    归档于: {dayjs(task.archivedAt).format('MM-DD HH:mm')}
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      </div>
                    )}
                  </Draggable>
                )}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>正在分析任务...</div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: dragInProgress ? 'brightness(0.95)' : 'brightness(1)'
    }}>
      {dragInProgress && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(24, 144, 255, 0.03)',
          zIndex: 100,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            color: '#1890ff',
            fontWeight: '500'
          }}>
            拖拽中...
          </div>
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <Title level={2}>四象限分析</Title>
            <Text type="secondary">
              基于艾森豪威尔矩阵，按重要性和紧急性对任务进行分类管理。拖拽任务可在象限间移动或归档。
            </Text>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => navigate('/tasks')}
            >
              任务管理系统
            </Button>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setArchivedModalVisible(true)}
            >
              查看归档 ({analysis.archived.length})
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAnalysis}
              loading={loading}
            >
              刷新分析
            </Button>
          </div>
        </div>
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            {renderTaskList(analysis.urgent_important, 'urgent_important')}
          </Col>
          <Col xs={24} lg={12}>
            {renderTaskList(analysis.important_not_urgent, 'important_not_urgent')}
          </Col>
          <Col xs={24} lg={12}>
            {renderTaskList(analysis.urgent_not_important, 'urgent_not_important')}
          </Col>
          <Col xs={24} lg={12}>
            {renderTaskList(analysis.not_urgent_not_important, 'not_urgent_not_important')}
          </Col>

          {/* 归档区域 */}
          <Col xs={24}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <InboxOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
                  <div>
                    <Title level={5} style={{ margin: 0, color: '#8c8c8c' }}>
                      归档区域
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      拖拽任务到此处进行归档 • {analysis.archived.length} 个任务
                    </Text>
                  </div>
                </div>
              }
              style={{
                borderTop: '4px solid #8c8c8c',
                borderStyle: 'dashed',
                opacity: 0.8
              }}
              bodyStyle={{ padding: '20px', minHeight: '80px', textAlign: 'center' }}
            >
              <Droppable droppableId="archived">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minHeight: '60px',
                      backgroundColor: snapshot.isDraggingOver ? '#fff7e6' : 'transparent',
                      borderRadius: '12px',
                      border: snapshot.isDraggingOver ? '3px dashed #faad14' : '2px dashed #d9d9d9',
                      display: 'flex',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: snapshot.isDraggingOver ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: snapshot.isDraggingOver ? '0 4px 16px rgba(250, 173, 20, 0.2)' : 'none',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {analysis.archived.length === 0 ? (
                      <Text type="secondary">
                        <InboxOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                        <div>将任务拖拽到此处进行归档</div>
                      </Text>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <InboxOutlined style={{ fontSize: '20px', color: '#8c8c8c' }} />
                        <Text>已归档 {analysis.archived.length} 个任务</Text>
                        <Button
                          type="link"
                          onClick={() => setArchivedModalVisible(true)}
                        >
                          查看详情
                        </Button>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </Col>
        </Row>
        </div>
      </DragDropContext>

      <Card style={{ marginTop: 24 }}>
        <Title level={4}>使用说明</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: 8 }} />
              <div style={{ fontWeight: 600, color: '#ff4d4f' }}>重要且紧急</div>
              <div style={{ fontSize: '12px', color: '#666' }}>危机处理，立即行动</div>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: 8 }} />
              <div style={{ fontWeight: 600, color: '#fa8c16' }}>重要但不紧急</div>
              <div style={{ fontSize: '12px', color: '#666' }}>目标规划，预防为主</div>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <InfoCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: 8 }} />
              <div style={{ fontWeight: 600, color: '#1890ff' }}>紧急但不重要</div>
              <div style={{ fontSize: '12px', color: '#666' }}>授权委托，减少干扰</div>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <MinusCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: 8 }} />
              <div style={{ fontWeight: 600, color: '#52c41a' }}>不紧急且不重要</div>
              <div style={{ fontSize: '12px', color: '#666' }}>减少浪费，提高效率</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 归档任务详情模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InboxOutlined style={{ marginRight: 8 }} />
            归档任务管理 ({analysis.archived.length})
          </div>
        }
        open={archivedModalVisible}
        onCancel={() => setArchivedModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          {analysis.archived.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: 16 }} />
              <div style={{ color: '#999' }}>暂无归档任务</div>
            </div>
          ) : (
            <List
              dataSource={analysis.archived}
              renderItem={(task) => (
                <List.Item
                  style={{
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    backgroundColor: '#fafafa',
                    opacity: 0.9
                  }}
                  actions={[
                    <Tooltip title="恢复到不重要且不紧急">
                      <Button
                        type="text"
                        icon={<ReloadOutlined />}
                        onClick={() => {
                          handleUnarchiveTask(task.id, 'not_urgent_not_important');
                          setArchivedModalVisible(false);
                        }}
                      >
                        恢复
                      </Button>
                    </Tooltip>,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        handleDeleteArchivedTask(task.id);
                      }}
                    >
                      删除
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            textDecoration: 'line-through',
                            color: '#999'
                          }}
                        >
                          {task.title}
                        </span>
                        <Tag color={getPriorityColor(task.priority)} size="small">
                          {getPriorityText(task.priority)}
                        </Tag>
                        <Tag color="default" size="small">已归档</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                          {task.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {task.dueDate && (
                            <span style={{ marginRight: '16px' }}>
                              原截止时间: {dayjs(task.dueDate).format('YYYY-MM-DD HH:mm')}
                            </span>
                          )}
                          {task.archivedAt && (
                            <span>
                              归档时间: {dayjs(task.archivedAt).format('YYYY-MM-DD HH:mm')}
                            </span>
                          )}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Quadrant;