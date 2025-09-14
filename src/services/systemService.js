import api from './api';

const systemService = {
  // 获取系统设置
  getSettings: async () => {
    return await api.get('/system/settings');
  },

  // 更新系统设置
  updateSettings: async (settings) => {
    return await api.put('/system/settings', settings);
  },

  // 执行系统备份
  backup: async () => {
    return await api.post('/system/backup');
  },

  // 获取系统统计信息
  getStats: async () => {
    return await api.get('/system/stats');
  }
};

export default systemService;