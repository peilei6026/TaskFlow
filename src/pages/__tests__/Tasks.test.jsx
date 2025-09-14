import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Tasks from '../Tasks';

// Mock services
vi.mock('../../services/taskService', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

vi.mock('../../services/userService', () => ({
  getUsers: vi.fn(),
}));

// Mock useAuth hook
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'ADMIN',
};

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
  }),
}));

// Mock TaskContext
const mockTaskContext = {
  tasks: [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'Test Description 1',
      status: 'TODO',
      priority: 'HIGH',
      assigneeId: 1,
      creatorId: 1,
      dueDate: '2024-12-31',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Test Description 2',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assigneeId: 2,
      creatorId: 1,
      dueDate: '2024-12-30',
      createdAt: '2024-01-02T00:00:00Z',
    },
  ],
  loading: false,
  error: null,
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
};

vi.mock('../../context/TaskContext', () => ({
  useTask: () => mockTaskContext,
  TaskProvider: ({ children }) => children,
}));

const TasksWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <Tasks />
    </AuthProvider>
  </BrowserRouter>
);

describe('Tasks Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tasks page correctly', () => {
    render(<TasksWrapper />);

    expect(screen.getByText('任务管理')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const loadingContext = {
      ...mockTaskContext,
      loading: true,
    };

    vi.mocked(require('../../context/TaskContext').useTaskContext).mockReturnValue(loadingContext);

    render(<TasksWrapper />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorContext = {
      ...mockTaskContext,
      error: 'Failed to load tasks',
    };

    vi.mocked(require('../../context/TaskContext').useTaskContext).mockReturnValue(errorContext);

    render(<TasksWrapper />);

    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
  });

  it('displays task details correctly', () => {
    render(<TasksWrapper />);

    // Check task 1 details
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();

    // Check task 2 details
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('handles task status filter', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const statusFilter = screen.getByRole('combobox', { name: /状态/ });
    await user.click(statusFilter);

    // Should show filter options
    expect(screen.getByText('全部')).toBeInTheDocument();
    expect(screen.getByText('待办')).toBeInTheDocument();
    expect(screen.getByText('进行中')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('handles priority filter', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const priorityFilter = screen.getByRole('combobox', { name: /优先级/ });
    await user.click(priorityFilter);

    // Should show priority options
    expect(screen.getByText('全部')).toBeInTheDocument();
    expect(screen.getByText('低')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const searchInput = screen.getByPlaceholderText('搜索任务...');
    await user.type(searchInput, 'Test Task 1');

    // Should filter tasks based on search
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
  });

  it('handles create task button click', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const createButton = screen.getByRole('button', { name: /新建任务/ });
    await user.click(createButton);

    // Should open create task modal
    expect(screen.getByText('新建任务')).toBeInTheDocument();
  });

  it('handles edit task button click', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const editButtons = screen.getAllByRole('button', { name: /编辑/ });
    await user.click(editButtons[0]);

    // Should open edit task modal
    expect(screen.getByText('编辑任务')).toBeInTheDocument();
  });

  it('handles delete task confirmation', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const deleteButtons = screen.getAllByRole('button', { name: /删除/ });
    await user.click(deleteButtons[0]);

    // Should show delete confirmation
    expect(screen.getByText('确认删除')).toBeInTheDocument();
    expect(screen.getByText('确定要删除这个任务吗？')).toBeInTheDocument();
  });

  it('handles task status change', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const statusSelects = screen.getAllByRole('combobox');
    const firstStatusSelect = statusSelects[0];
    
    await user.click(firstStatusSelect);
    await user.click(screen.getByText('进行中'));

    expect(mockTaskContext.updateTask).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        status: 'IN_PROGRESS',
      })
    );
  });

  it('handles task priority change', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const prioritySelects = screen.getAllByRole('combobox');
    const firstPrioritySelect = prioritySelects[1];
    
    await user.click(firstPrioritySelect);
    await user.click(screen.getByText('低'));

    expect(mockTaskContext.updateTask).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        priority: 'LOW',
      })
    );
  });

  it('displays pagination correctly', () => {
    const paginatedContext = {
      ...mockTaskContext,
      tasks: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        title: `Task ${i + 1}`,
        description: `Description ${i + 1}`,
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: 1,
        creatorId: 1,
        dueDate: '2024-12-31',
        createdAt: '2024-01-01T00:00:00Z',
      })),
    };

    vi.mocked(require('../../context/TaskContext').useTaskContext).mockReturnValue(paginatedContext);

    render(<TasksWrapper />);

    // Should show pagination
    expect(screen.getByText('共 25 条记录')).toBeInTheDocument();
  });

  it('handles empty state', () => {
    const emptyContext = {
      ...mockTaskContext,
      tasks: [],
    };

    vi.mocked(require('../../context/TaskContext').useTaskContext).mockReturnValue(emptyContext);

    render(<TasksWrapper />);

    expect(screen.getByText('暂无任务')).toBeInTheDocument();
    expect(screen.getByText('点击"新建任务"开始创建您的第一个任务')).toBeInTheDocument();
  });

  it('handles task assignment', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const assigneeSelects = screen.getAllByRole('combobox');
    const firstAssigneeSelect = assigneeSelects[2];
    
    await user.click(firstAssigneeSelect);
    await user.click(screen.getByText('Test User'));

    expect(mockTaskContext.updateTask).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        assigneeId: 1,
      })
    );
  });

  it('handles due date change', async () => {
    const user = userEvent.setup();
    render(<TasksWrapper />);

    const dateInputs = screen.getAllByRole('textbox');
    const firstDateInput = dateInputs[0];
    
    await user.clear(firstDateInput);
    await user.type(firstDateInput, '2024-12-25');

    expect(mockTaskContext.updateTask).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        dueDate: '2024-12-25',
      })
    );
  });
});