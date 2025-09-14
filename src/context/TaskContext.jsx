import React, { createContext, useContext, useState, useCallback } from 'react';
import taskService from '../services/taskService';
import { message } from 'antd';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 触发数据刷新
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // 获取任务列表
  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await taskService.getTasks(filters);
      if (response && response.success && response.data) {
        const tasksList = Array.isArray(response.data.tasks) ?
          response.data.tasks :
          Array.isArray(response.data) ?
          response.data : [];

        setTasks(tasksList);
        return { data: tasksList, total: response.data.total || tasksList.length };
      }
      return { data: [], total: 0 };
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      message.error('获取任务列表失败');
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新任务状态
  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      const response = await taskService.updateTaskStatus(taskId, status);
      if (response.success) {
        // 更新本地状态
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status } : task
          )
        );

        const statusText = {
          'TODO': '待开始',
          'IN_PROGRESS': '进行中',
          'COMPLETED': '已完成',
          'todo': '待开始',
          'in_progress': '进行中',
          'completed': '已完成'
        };
        message.success(`任务状态已更新为「${statusText[status]}」`);

        // 触发其他组件刷新
        triggerRefresh();
        return true;
      } else {
        message.error(response.error?.message || '状态更新失败');
        return false;
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      message.error('状态更新失败');
      return false;
    }
  }, [triggerRefresh]);

  // 创建任务
  const createTask = useCallback(async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      if (response.success) {
        setTasks(prevTasks => [response.data, ...prevTasks]);
        message.success('任务创建成功');
        triggerRefresh();
        return response.data;
      } else {
        message.error(response.error?.message || '创建失败');
        return null;
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      message.error('创建失败');
      return null;
    }
  }, [triggerRefresh]);

  // 更新任务
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData);
      if (response.success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, ...response.data } : task
          )
        );
        message.success('任务更新成功');
        triggerRefresh();
        return response.data;
      } else {
        message.error(response.error?.message || '更新失败');
        return null;
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      message.error('更新失败');
      return null;
    }
  }, [triggerRefresh]);

  // 删除任务
  const deleteTask = useCallback(async (taskId) => {
    try {
      const response = await taskService.deleteTask(taskId);
      if (response.success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        message.success('任务删除成功');
        triggerRefresh();
        return true;
      } else {
        message.error(response.error?.message || '删除失败');
        return false;
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      message.error('删除失败');
      return false;
    }
  }, [triggerRefresh]);

  // 根据用户ID获取用户任务
  const getUserTasks = useCallback((userId) => {
    return tasks.filter(task => task.assigneeId === userId);
  }, [tasks]);

  // 获取任务统计
  const getTaskStats = useCallback(async (userId = null) => {
    try {
      const response = await taskService.getTaskStats(userId);
      if (response && response.success) {
        return response.data;
      }
      // 降级到本地计算
      const filteredTasks = userId ? getUserTasks(userId) : tasks;
      const completed = filteredTasks.filter(task => task.status === 'COMPLETED').length;
      const inProgress = filteredTasks.filter(task => task.status === 'IN_PROGRESS').length;
      const todo = filteredTasks.filter(task => task.status === 'TODO').length;
      const total = filteredTasks.length;

      return {
        total,
        completed,
        inProgress,
        todo,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    } catch (error) {
      console.error('Failed to fetch task stats:', error);
      // 使用本地数据作为fallback
      const filteredTasks = userId ? getUserTasks(userId) : tasks;
      const completed = filteredTasks.filter(task => task.status === 'COMPLETED').length;
      const inProgress = filteredTasks.filter(task => task.status === 'IN_PROGRESS').length;
      const todo = filteredTasks.filter(task => task.status === 'TODO').length;
      const total = filteredTasks.length;

      return {
        total,
        completed,
        inProgress,
        todo,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }
  }, [tasks, getUserTasks]);

  // 四象限分类
  const categorizeTasksToQuadrants = useCallback((userId = null) => {
    const filteredTasks = userId ? getUserTasks(userId) : tasks;
    const now = new Date();

    // 调整紧急性判断：2天内为紧急
    const urgentThreshold = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const quadrants = {
      urgent_important: [],
      urgent_not_important: [],
      not_urgent_important: [],
      not_urgent_not_important: []
    };

    filteredTasks.forEach(task => {
      if (task.status === 'COMPLETED' || task.status === 'completed') return; // 排除已完成的任务

      const dueDate = task.dueDate ? new Date(task.dueDate) : null;

      // 更灵活的紧急性判断逻辑
      let isUrgent = false;
      if (dueDate) {
        isUrgent = dueDate <= urgentThreshold;
      } else {
        // 如果没有截止日期，根据优先级和创建时间判断
        const createdDate = new Date(task.createdAt);
        const daysSinceCreated = (now - createdDate) / (1000 * 60 * 60 * 24);
        isUrgent = (task.priority === 'HIGH' || task.priority === 'high') && daysSinceCreated <= 1;
      }

      // 重要性判断：高优先级为重要，中等优先级根据具体情况判断
      const isImportant = (task.priority === 'HIGH' || task.priority === 'high') ||
        (task.priority === 'medium' && task.tags &&
         (task.tags.includes('urgent') || task.tags.includes('critical') ||
          task.tags.includes('architecture') || task.tags.includes('security')));

      const quadrantTask = {
        id: task.id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        assigneeId: task.assigneeId,
        tags: task.tags || []
      };

      if (isUrgent && isImportant) {
        quadrants.urgent_important.push(quadrantTask);
      } else if (!isUrgent && isImportant) {
        quadrants.not_urgent_important.push(quadrantTask);
      } else if (isUrgent && !isImportant) {
        quadrants.urgent_not_important.push(quadrantTask);
      } else {
        quadrants.not_urgent_not_important.push(quadrantTask);
      }
    });

    return quadrants;
  }, [tasks, getUserTasks]);

  const value = {
    tasks,
    loading,
    refreshTrigger,
    fetchTasks,
    updateTaskStatus,
    createTask,
    updateTask,
    deleteTask,
    getUserTasks,
    getTaskStats,
    categorizeTasksToQuadrants,
    triggerRefresh
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};