import { describe, it, expect, vi, beforeEach } from 'vitest';
import taskService from '../taskService';
 
// Mock the global request function that the service uses
global.mockRequest = vi.fn();

// Mock Mock.js
vi.mock('mockjs', () => ({
  mock: vi.fn((url, handler) => {
    // Store the mock handler for testing
    global.mockHandlers = global.mockHandlers || {};
    global.mockHandlers[url] = handler;
  }),
}));

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.mockHandlers = {};
  });

  describe('getTasks', () => {
    it('returns tasks successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          tasks: [
            { id: 1, title: 'Test Task', status: 'todo' },
            { id: 2, title: 'Another Task', status: 'completed' },
          ],
          total: 2,
        },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.getTasks({ page: 1, limit: 10 });

      expect(result).toEqual(mockResponse);
      expect(result.data.tasks).toHaveLength(2);
      expect(result.data.total).toBe(2);
    });

    it('handles empty task list', async () => {
      const mockResponse = {
        success: true,
        data: { tasks: [], total: 0 },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.getTasks();

      expect(result.data.tasks).toEqual([]);
      expect(result.data.total).toBe(0);
    });

    it('handles network error gracefully', async () => {
      const networkError = new Error('Network request failed');
      global.mockRequest = vi.fn().mockRejectedValue(networkError);

      await expect(taskService.getTasks()).rejects.toThrow('网络错误，请检查网络连接');
    });

    it('filters tasks by status', async () => {
      const mockResponse = {
        success: true,
        data: {
          tasks: [{ id: 1, title: 'Todo Task', status: 'todo' }],
          total: 1,
        },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.getTasks({ status: 'todo' });

      expect(result.data.tasks[0].status).toBe('todo');
    });
  });

  describe('createTask', () => {
    it('creates task successfully', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task description',
        priority: 'high',
        assigneeId: 1,
      };

      const mockResponse = {
        success: true,
        data: { id: 3, ...newTask, status: 'todo' },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.createTask(newTask);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe(newTask.title);
      expect(result.data.id).toBeDefined();
    });

    it('handles validation errors', async () => {
      const invalidTask = {};

      const mockResponse = {
        success: false,
        error: { message: 'Title is required' },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.createTask(invalidTask);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Title is required');
    });
  });

  describe('updateTask', () => {
    it('updates task successfully', async () => {
      const taskId = 1;
      const updates = { title: 'Updated Title', status: 'in_progress' };

      const mockResponse = {
        success: true,
        data: { id: taskId, ...updates },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.updateTask(taskId, updates);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Updated Title');
      expect(result.data.status).toBe('in_progress');
    });

    it('handles task not found error', async () => {
      const taskId = 999;
      const updates = { title: 'Updated Title' };

      const mockResponse = {
        success: false,
        error: { message: 'Task not found' },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.updateTask(taskId, updates);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('deletes task successfully', async () => {
      const taskId = 1;

      const mockResponse = {
        success: true,
        message: 'Task deleted successfully',
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.deleteTask(taskId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Task deleted successfully');
    });

    it('handles permission error', async () => {
      const taskId = 1;

      const mockResponse = {
        success: false,
        error: { message: 'Permission denied' },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.deleteTask(taskId);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Permission denied');
    });
  });

  describe('updateTaskStatus', () => {
    it('updates task status successfully', async () => {
      const taskId = 1;
      const newStatus = 'completed';

      const mockResponse = {
        success: true,
        data: { id: taskId, status: newStatus },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.updateTaskStatus(taskId, newStatus);

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('completed');
    });

    it('validates status values', async () => {
      const taskId = 1;
      const invalidStatus = 'invalid_status';

      const mockResponse = {
        success: false,
        error: { message: 'Invalid status value' },
      };

      global.mockRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await taskService.updateTaskStatus(taskId, invalidStatus);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Invalid status value');
    });
  });
});