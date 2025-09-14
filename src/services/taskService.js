import api from './api';

const taskService = {
  // 获取任务列表
  getTasks: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';

    return await api.get(url);
  },

  // 获取任务详情
  getTaskById: async (id) => {
    return await api.get(`/tasks/${id}`);
  },

  // 创建任务
  createTask: async (taskData) => {
    return await api.post('/tasks', taskData);
  },

  // 更新任务
  updateTask: async (id, taskData) => {
    return await api.put(`/tasks/${id}`, taskData);
  },

  // 更新任务状态
  updateTaskStatus: async (id, status) => {
    return await api.put(`/tasks/${id}`, { status });
  },

  // 分配任务
  assignTask: async (id, assigneeId) => {
    return await api.put(`/tasks/${id}`, { assigneeId });
  },

  // 删除任务
  deleteTask: async (id) => {
    return await api.delete(`/tasks/${id}`);
  },

  // 获取任务统计
  getTaskStats: async (userId) => {
    const url = userId ? `/tasks/stats?userId=${userId}` : '/tasks/stats';
    return await api.get(url);
  }
};

export default taskService;