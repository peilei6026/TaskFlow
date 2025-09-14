import api from './api';

const userService = {
  // 获取用户列表
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/users?${queryString}` : '/users';

    return await api.get(url);
  },

  // 获取用户详情
  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  },

  // 创建用户
  createUser: async (userData) => {
    return await api.post('/users', userData);
  },

  // 更新用户信息
  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },

  // 更新用户资料
  updateProfile: async (userData) => {
    return await api.put('/users/profile', userData);
  },

  // 修改密码
  changePassword: async (passwordData) => {
    return await api.put('/users/password', passwordData);
  },

  // 删除用户
  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  }
};

export default userService;