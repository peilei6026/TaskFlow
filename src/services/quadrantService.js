import api from './api';

const quadrantService = {
  // 获取四象限分析数据
  getAnalysis: async () => {
    return await api.get('/quadrant/analysis');
  },

  // 移动任务到指定象限
  moveTask: async (taskId, quadrant) => {
    return await api.post('/quadrant/move', { taskId, quadrant });
  },

  // 归档任务
  archiveTask: async (taskId) => {
    return await api.post('/quadrant/archive', { taskId });
  },

  // 取消归档任务
  unarchiveTask: async (taskId, targetQuadrant) => {
    return await api.post('/quadrant/unarchive', { taskId, targetQuadrant });
  },

  // 删除已归档任务
  deleteArchivedTask: async (taskId) => {
    return await api.delete(`/quadrant/archived/${taskId}`);
  }
};

export default quadrantService;