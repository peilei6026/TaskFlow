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
  Card
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const { user: currentUser } = useAuth();

  const roleOptions = [
    { value: 'ADMIN', label: '管理员', color: 'red' },
    { value: 'USER', label: '普通用户', color: 'blue' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: '启用', color: 'green' },
    { value: 'INACTIVE', label: '禁用', color: 'red' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const fetchUsers = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };

      const response = await userService.getUsers(params);
      if (response && response.success && response.data) {
        const usersList = Array.isArray(response.data.users) ?
          response.data.users :
          Array.isArray(response.data) ?
          response.data : [];

        setUsers(usersList);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || usersList.length
        }));
      } else {
        console.warn('Invalid users response format:', response);
        setUsers([]);
        message.warning('数据格式异常，请稍后重试');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      message.error('获取用户列表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers(values);
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setModalVisible(true);
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser.id) {
      message.warning('不能删除自己的账户');
      return;
    }

    try {
      const response = await userService.deleteUser(userId);
      if (response.success) {
        message.success('用户已成功删除');
        fetchUsers();
      } else {
        message.error(response.error?.message || '删除失败，请稍后重试');
      }
    } catch (error) {
      message.error('删除失败，请检查网络连接');
    }
  };

  const handleSubmit = async (values) => {
    try {
      let response;
      const userData = {
        ...values,
        username: values.name, // 映射 name 字段到 username
      };

      if (editingUser) {
        response = await userService.updateUser(editingUser.id, userData);
      } else {
        response = await userService.createUser({
          ...userData,
          password: values.password || '123456'
        });
      }

      if (response.success) {
        message.success(editingUser ? '用户信息更新成功' : '用户创建成功');
        setModalVisible(false);
        fetchUsers();
      } else {
        message.error(response.error?.message || (editingUser ? '更新失败，请稍后重试' : '创建失败，请稍后重试'));
      }
    } catch (error) {
      message.error(editingUser ? '更新失败，请检查网络连接' : '创建失败，请检查网络连接');
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const option = roleOptions.find(opt => opt.value === role);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (lastLoginAt) =>
        lastLoginAt ? new Date(lastLoginAt).toLocaleString() : '从未登录',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            disabled={record.id === currentUser.id}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={record.id === currentUser.id}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (currentUser.role !== 'ADMIN') {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>权限不足</h3>
          <p>只有管理员可以访问用户管理页面</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="name">
            <Input
              placeholder="用户姓名"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="email">
            <Input
              placeholder="邮箱"
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="role">
            <Select placeholder="角色" style={{ width: 120 }} allowClear>
              {roleOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" style={{ width: 120 }} allowClear>
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
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
              fetchUsers();
            }}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="用户列表"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建用户
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
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
        title={editingUser ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效邮箱' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {roleOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;