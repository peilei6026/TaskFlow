import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Typography, message, Dropdown, Button, Alert } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../hooks/useAuth';
import './FourQuadrant.css';

const { Title, Text } = Typography;

const FourQuadrant = ({ initialItems = {} }) => {
  const { user } = useAuth();
  const { updateTaskStatus, updateTask } = useTask();

  const [items, setItems] = useState({
    urgent_important: initialItems.urgent_important || [],
    urgent_not_important: initialItems.urgent_not_important || [],
    not_urgent_important: initialItems.not_urgent_important || [],
    not_urgent_not_important: initialItems.not_urgent_not_important || []
  });

  const [showingDemoData, setShowingDemoData] = useState(false);

  // 当外部数据更新时，同步内部状态
  useEffect(() => {
    const updatedItems = {
      urgent_important: initialItems.urgent_important || [],
      urgent_not_important: initialItems.urgent_not_important || [],
      not_urgent_important: initialItems.not_urgent_important || [],
      not_urgent_not_important: initialItems.not_urgent_not_important || []
    };

    // 如果所有象限都为空，提供示例数据
    const totalItems = Object.values(updatedItems).reduce((sum, items) => sum + items.length, 0);
    if (totalItems === 0) {
      setShowingDemoData(true);
      updatedItems.urgent_important = [
        {
          id: 'demo-1',
          title: '修复生产环境bug',
          description: '紧急修复影响用户的关键问题',
          priority: 'high',
          status: 'todo',
          dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6小时后
          assigneeId: user.id,
          tags: ['urgent', 'hotfix']
        }
      ];

      updatedItems.urgent_not_important = [
        {
          id: 'demo-2',
          title: '回复客户邮件',
          description: '处理客户的一般性咨询',
          priority: 'low',
          status: 'todo',
          dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12小时后
          assigneeId: user.id,
          tags: ['communication']
        }
      ];

      updatedItems.not_urgent_important = [
        {
          id: 'demo-3',
          title: '技术架构规划',
          description: '制定下季度的技术发展计划',
          priority: 'high',
          status: 'todo',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 一周后
          assigneeId: user.id,
          tags: ['architecture', 'planning']
        }
      ];

      updatedItems.not_urgent_not_important = [
        {
          id: 'demo-4',
          title: '整理桌面文件',
          description: '清理和整理工作桌面',
          priority: 'low',
          status: 'todo',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后
          assigneeId: user.id,
          tags: ['organization']
        }
      ];
    } else {
      setShowingDemoData(false);
    }

    setItems(updatedItems);
  }, [initialItems, user.id]);

  const quadrants = {
    urgent_important: {
      title: '紧急且重要',
      subtitle: '立即执行',
      color: '#ff4d4f',
      bgColor: '#fff2f0'
    },
    urgent_not_important: {
      title: '紧急不重要',
      subtitle: '委托他人',
      color: '#faad14',
      bgColor: '#fffbe6'
    },
    not_urgent_important: {
      title: '不紧急但重要',
      subtitle: '制定计划',
      color: '#52c41a',
      bgColor: '#f6ffed'
    },
    not_urgent_not_important: {
      title: '不紧急不重要',
      subtitle: '尽量避免',
      color: '#1890ff',
      bgColor: '#f0f5ff'
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceQuadrant = source.droppableId;
    const destQuadrant = destination.droppableId;

    // 检查是否为示例数据
    if (draggableId.startsWith('demo-')) {
      message.info('这是示例数据，无法移动。请创建真实任务进行操作。');
      return;
    }

    const taskId = parseInt(draggableId);

    // 检查权限 - 只能移动分配给自己的任务或管理员权限
    const movedTask = items[sourceQuadrant].find(item => item.id === draggableId);
    if (movedTask.assigneeId !== user.id && user.role !== 'ADMIN') {
      message.error('您只能移动分配给您的任务');
      return;
    }

    // 乐观更新UI
    setItems(prevItems => {
      const newItems = { ...prevItems };

      // 从源象限移除项目
      const sourceItems = Array.from(newItems[sourceQuadrant]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      newItems[sourceQuadrant] = sourceItems;

      // 添加到目标象限
      const destItems = Array.from(newItems[destQuadrant]);
      destItems.splice(destination.index, 0, movedItem);
      newItems[destQuadrant] = destItems;

      return newItems;
    });

    // 根据目标象限更新任务属性
    const updates = getTaskUpdatesForQuadrant(destQuadrant);

    try {
      await updateTask(taskId, updates);
      message.success(`任务已移动到「${quadrants[destQuadrant].title}」`);
    } catch (error) {
      // 如果更新失败，回滚UI变化
      setItems({
        urgent_important: initialItems.urgent_important || [],
        urgent_not_important: initialItems.urgent_not_important || [],
        not_urgent_important: initialItems.not_urgent_important || [],
        not_urgent_not_important: initialItems.not_urgent_not_important || []
      });
      message.error('任务移动失败，请稍后重试');
    }
  };

  // 根据象限获取任务更新数据
  const getTaskUpdatesForQuadrant = (quadrant) => {
    const now = new Date();

    switch (quadrant) {
      case 'urgent_important':
        return {
          priority: 'high',
          dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() // 1天后
        };
      case 'urgent_not_important':
        return {
          priority: 'low',
          dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() // 1天后
        };
      case 'not_urgent_important':
        return {
          priority: 'high',
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后
        };
      case 'not_urgent_not_important':
        return {
          priority: 'low',
          dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14天后
        };
      default:
        return {};
    }
  };

  // 处理任务状态更改
  const handleStatusChange = async (taskId, newStatus) => {
    // 如果是示例数据，不进行实际更新
    if (taskId.toString().startsWith('demo-')) {
      message.info('这是示例数据，无法修改状态。请创建真实任务进行操作。');
      return;
    }

    try {
      await updateTaskStatus(parseInt(taskId), newStatus);
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="four-quadrant-container">
        {showingDemoData && (
          <Alert
            message="示例数据展示"
            description="当前显示的是示例数据，用于演示四象限时间管理法。您可以到任务管理页面创建真实任务，或等待系统为您分配任务。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            closable
          />
        )}
        <div className="quadrant-grid">
          {Object.entries(quadrants).map(([quadrantId, quadrant]) => (
            <div key={quadrantId} className="quadrant">
              <Card
                className="quadrant-card"
                style={{
                  borderColor: quadrant.color,
                  backgroundColor: quadrant.bgColor
                }}
                title={
                  <div className="quadrant-header">
                    <Title level={4} style={{ color: quadrant.color, margin: 0 }}>
                      {quadrant.title}
                    </Title>
                    <Text type="secondary">{quadrant.subtitle}</Text>
                  </div>
                }
              >
                <Droppable droppableId={quadrantId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`quadrant-content ${
                        snapshot.isDraggingOver ? 'dragging-over' : ''
                      }`}
                    >
                      {items[quadrantId].map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`quadrant-item ${
                                snapshot.isDragging ? 'dragging' : ''
                              }`}
                            >
                              <Card
                                size="small"
                                hoverable
                                extra={
                                  <Dropdown
                                    menu={{
                                      items: [
                                        {
                                          key: 'todo',
                                          label: '待开始',
                                          onClick: () => handleStatusChange(item.id, 'todo'),
                                          disabled: item.status === 'todo'
                                        },
                                        {
                                          key: 'in_progress',
                                          label: '进行中',
                                          onClick: () => handleStatusChange(item.id, 'in_progress'),
                                          disabled: item.status === 'in_progress'
                                        },
                                        {
                                          key: 'completed',
                                          label: '已完成',
                                          onClick: () => handleStatusChange(item.id, 'completed'),
                                          disabled: item.status === 'completed'
                                        }
                                      ]
                                    }}
                                    trigger={['click']}
                                    disabled={item.assigneeId !== user.id && user.role !== 'ADMIN'}
                                  >
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<MoreOutlined />}
                                      disabled={item.assigneeId !== user.id && user.role !== 'ADMIN'}
                                      title={
                                        item.assigneeId !== user.id && user.role !== 'ADMIN'
                                          ? '只有任务负责人或管理员可以修改状态'
                                          : '点击修改状态'
                                      }
                                    />
                                  </Dropdown>
                                }
                              >
                                <div className="item-content">
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Text strong style={{ flex: 1, marginRight: 8 }}>{item.title}</Text>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                      <span
                                        className={`status-badge status-${item.status}`}
                                        style={{
                                          fontSize: '10px',
                                          padding: '2px 6px',
                                          borderRadius: '10px',
                                          backgroundColor:
                                            item.status === 'completed' ? '#f6ffed' :
                                            item.status === 'in_progress' ? '#e6f7ff' : '#fff2f0',
                                          color:
                                            item.status === 'completed' ? '#52c41a' :
                                            item.status === 'in_progress' ? '#1890ff' : '#faad14',
                                          border: `1px solid ${
                                            item.status === 'completed' ? '#b7eb8f' :
                                            item.status === 'in_progress' ? '#91d5ff' : '#ffd591'
                                          }`
                                        }}
                                      >
                                        {
                                          item.status === 'completed' ? '已完成' :
                                          item.status === 'in_progress' ? '进行中' : '待开始'
                                        }
                                      </span>
                                    </div>
                                  </div>
                                  {item.description && (
                                    <Text className="item-description">
                                      {item.description}
                                    </Text>
                                  )}
                                  {item.dueDate && (
                                    <div style={{ marginTop: 4, fontSize: '11px', color: '#999' }}>
                                      截止: {new Date(item.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {items[quadrantId].length === 0 && (
                        <div className="empty-placeholder">
                          将任务拖拽到这里
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default FourQuadrant;