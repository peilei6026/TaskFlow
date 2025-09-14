import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useTask } from '../context/TaskContext';
import taskService from '../services/taskService';
import userService from '../services/userService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const Tasks = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    fetchTasks,
    updateTaskStatus: updateTaskStatusContext,
    createTask: createTaskContext,
    updateTask: updateTaskContext,
    deleteTask: deleteTaskContext
  } = useTask();

  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 权限检查辅助函数
  const canEditTask = (task) => {
    return task.creatorId === user.id || user.role === 'ADMIN';
  };

  const canDeleteTask = (task) => {
    return task.creatorId === user.id || user.role === 'ADMIN';
  };

  const canChangeTaskStatus = (task) => {
    return task.assigneeId === user.id || user.role === 'ADMIN';
  };

  const priorityOptions = [
    { value: 'LOW', label: '低', color: 'green' },
    { value: 'MEDIUM', label: '中', color: 'orange' },
    { value: 'HIGH', label: '高', color: 'red' }
  ];

  const statusOptions = [
    { value: 'TODO', label: '待开始', color: 'default' },
    { value: 'IN_PROGRESS', label: '进行中', color: 'blue' },
    { value: 'COMPLETED', label: '已完成', color: 'green' },
    { value: 'CANCELLED', label: '已取消', color: 'red' }
  ];

  useEffect(() => {
    loadTasks();
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const loadTasks = async (filters = {}) => {
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };

      const result = await fetchTasks(params);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      if (response && response.success && response.data) {
        // 确保返回的是数组，并提供默认值
        const usersList = Array.isArray(response.data.users) ? response.data.users :
                         Array.isArray(response.data) ? response.data : [];
        setUsers(usersList);
      } else {
        console.warn('Invalid users response format:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  const handleSearch = (values) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadTasks(values);
  };

  const handleCreate = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (task) => {
    if (!canEditTask(task)) {
      message.error('您没有权限编辑此任务，只有任务创建者或管理员可以编辑');
      return;
    }

    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);

    if (!canDeleteTask(task)) {
      message.error('您没有权限删除此任务，只有任务创建者或管理员可以删除');
      return;
    }

    const success = await deleteTaskContext(taskId);
    if (success) {
      loadTasks(); // 重新加载当前页面
    }
  };

  const handleSubmit = async (values) => {
    const taskData = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null
    };

    let result;
    if (editingTask) {
      result = await updateTaskContext(editingTask.id, taskData);
    } else {
      result = await createTaskContext(taskData);
    }

    if (result) {
      setModalVisible(false);
      loadTasks(); // 重新加载当前页面
    }
  };

  const handleStatusChange = async (taskId, status) => {
    const task = tasks.find(t => t.id === taskId);

    if (!canChangeTaskStatus(task)) {
      message.error('您没有权限修改此任务的状态，只有任务负责人或管理员可以操作');
      return;
    }

    await updateTaskStatusContext(taskId, status);
  };

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const option = priorityOptions.find(opt => opt.value === priority);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const option = statusOptions.find(opt => opt.value === status);
        const canChange = canChangeTaskStatus(record);

        return (
          <Select
            value={status}
            style={{ width: 100 }}
            onChange={(value) => handleStatusChange(record.id, value)}
            disabled={!canChange}
            title={!canChange ? '只有任务负责人或管理员可以修改状态' : ''}
          >
            {statusOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                <Tag color={opt.color}>{opt.label}</Tag>
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '负责人',
      dataIndex: 'assigneeId',
      key: 'assigneeId',
      render: (assigneeId) => {
        const assignee = users.find(u => u.id === assigneeId);
        return assignee ? assignee.name : '未分配';
      },
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => {
        if (!dueDate) return '未设置';
        const date = dayjs(dueDate);
        const isOverdue = date.isBefore(dayjs(), 'day');
        return (
          <span style={{ color: isOverdue ? '#f5222d' : undefined }}>
            {date.format('YYYY-MM-DD')}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const canEdit = canEditTask(record);
        const canDelete = canDeleteTask(record);

        return (
          <Space size="middle">
            <Button
              type="link"
              style={{width:20}}
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={!canEdit}
              title={!canEdit ? '只有任务创建者或管理员可以编辑' : ''}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个任务吗？"
              onConfirm={() => handleDelete(record.id)}
              disabled={!canDelete}
            >
              <Button
                type="link"
                danger
                  style={{width:20,marginLeft:10}}
                icon={<DeleteOutlined />}
                disabled={!canDelete}
                title={!canDelete ? '只有任务创建者或管理员可以删除' : ''}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {user.role !== 'ADMIN' && (
        <Alert
          message="权限提示"
          description={
            <div>
              <p><strong>任务查看：</strong>只能查看您创建的任务或分配给您的任务</p>
              <p><strong>任务状态修改：</strong>只能修改分配给您的任务状态</p>
              <p><strong>任务编辑/删除：</strong>只能编辑/删除您创建的任务</p>
              <p><strong>管理员</strong>拥有所有任务的完整权限</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="title">
            <Input
              placeholder="任务名称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" style={{ width: 120 }} allowClear>
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="priority">
            <Select placeholder="优先级" style={{ width: 120 }} allowClear>
              {priorityOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assigneeId">
            <Select placeholder="负责人" style={{ width: 120 }} allowClear>
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => {
              searchForm.resetFields();
              loadTasks();
            }}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="任务列表"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建任务
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={tasks}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize
              }));
            }
          }}
        />
      </Card>

      <Modal
        title={editingTask ? '编辑任务' : '新建任务'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea rows={4} placeholder="请输入任务描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  {priorityOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assigneeId"
                label="负责人"
                rules={[{ required: true, message: '请选择负责人' }]}
              >
                <Select placeholder="请选择负责人">
                  {users.map(user => (
                    <Option key={user.id} value={user.id}>{user.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dueDate"
            label="截止日期"
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="请选择截止日期"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;