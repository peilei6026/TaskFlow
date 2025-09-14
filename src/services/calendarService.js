import api from './api';

const calendarService = {
  // 获取日历事件列表
  getEvents: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/calendar/events?${queryString}` : '/calendar/events';

    return await api.get(url);
  },

  // 创建日历事件
  createEvent: async (eventData) => {
    return await api.post('/calendar/events', eventData);
  },

  // 更新日历事件
  updateEvent: async (id, eventData) => {
    return await api.put(`/calendar/events/${id}`, eventData);
  },

  // 删除日历事件
  deleteEvent: async (id) => {
    return await api.delete(`/calendar/events/${id}`);
  }
};

export default calendarService;