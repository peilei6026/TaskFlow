import api from './api';

const timeEntryService = {
  // 获取时间记录列表
  getTimeEntries: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/time-entries?${queryString}` : '/time-entries';

    return await api.get(url);
  },

  // 创建时间记录
  createTimeEntry: async (entryData) => {
    return await api.post('/time-entries', entryData);
  },

  // 更新时间记录
  updateTimeEntry: async (id, entryData) => {
    return await api.put(`/time-entries/${id}`, entryData);
  },

  // 删除时间记录
  deleteTimeEntry: async (id) => {
    return await api.delete(`/time-entries/${id}`);
  },

  // 获取时间统计
  getTimeStats: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/time-entries/stats?${queryString}` : '/time-entries/stats';

    return await api.get(url);
  }
};

export default timeEntryService;