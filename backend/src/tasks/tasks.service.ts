import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UserRole } from '../types/enums';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, creatorId: number) {
    // 如果指定了assigneeId，检查用户是否存在
    if (createTaskDto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: createTaskDto.assigneeId },
      });
      if (!assignee) {
        throw new BadRequestException('指定的分配用户不存在');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        priority: createTaskDto.priority,
        assigneeId: createTaskDto.assigneeId,
        tags: createTaskDto.tags ? JSON.stringify(createTaskDto.tags) : null,
        estimatedHours: createTaskDto.estimatedHours,
        creatorId,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            timeEntries: true,
          },
        },
      },
    });

    return task;
  }

  async findAll(queryDto: QueryTasksDto, currentUserId: number, currentUserRole: UserRole) {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assigneeId,
      creatorId,
      dueDateFrom,
      dueDateTo,
      search,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    // 非管理员用户只能看到自己创建或分配给自己的任务
    if (currentUserRole !== UserRole.ADMIN) {
      where.OR = [
        { creatorId: currentUserId },
        { assigneeId: currentUserId },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (creatorId) {
      where.creatorId = creatorId;
    }

    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) {
        where.dueDate.gte = new Date(dueDateFrom);
      }
      if (dueDateTo) {
        where.dueDate.lte = new Date(dueDateTo);
      }
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    // 构建排序
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          assignee: {
            select: {
              id: true,
              username: true,
              email: true,
              displayName: true,
              name: true,
            },
          },
          creator: {
            select: {
              id: true,
              username: true,
              email: true,
              displayName: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
              timeEntries: true,
            },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, currentUserId: number, currentUserRole: UserRole) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            name: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        timeEntries: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                name: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
        _count: {
          select: {
            comments: true,
            timeEntries: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    // 权限检查：非管理员只能查看自己创建或分配给自己的任务
    if (
      currentUserRole !== UserRole.ADMIN &&
      task.creatorId !== currentUserId &&
      task.assigneeId !== currentUserId
    ) {
      throw new ForbiddenException('没有权限查看此任务');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, currentUserId: number, currentUserRole: UserRole) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException('任务不存在');
    }

    // 权限检查：非管理员只能更新自己创建的任务或分配给自己的任务
    if (
      currentUserRole !== UserRole.ADMIN &&
      existingTask.creatorId !== currentUserId &&
      existingTask.assigneeId !== currentUserId
    ) {
      throw new ForbiddenException('没有权限修改此任务');
    }

    // 如果指定了assigneeId，检查用户是否存在
    if (updateTaskDto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.assigneeId },
      });
      if (!assignee) {
        throw new BadRequestException('指定的分配用户不存在');
      }
    }

    const updateData: any = {};

    if (updateTaskDto.title !== undefined) updateData.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) updateData.description = updateTaskDto.description;
    if (updateTaskDto.status !== undefined) updateData.status = updateTaskDto.status;
    if (updateTaskDto.priority !== undefined) updateData.priority = updateTaskDto.priority;
    if (updateTaskDto.assigneeId !== undefined) updateData.assigneeId = updateTaskDto.assigneeId;
    if (updateTaskDto.tags !== undefined) updateData.tags = updateTaskDto.tags ? JSON.stringify(updateTaskDto.tags) : null;
    if (updateTaskDto.estimatedHours !== undefined) updateData.estimatedHours = updateTaskDto.estimatedHours;
    if (updateTaskDto.actualHours !== undefined) updateData.actualHours = updateTaskDto.actualHours;
    if (updateTaskDto.progress !== undefined) updateData.progress = updateTaskDto.progress;
    if (updateTaskDto.dueDate !== undefined) updateData.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null;

    const task = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            timeEntries: true,
          },
        },
      },
    });

    return task;
  }

  async remove(id: number, currentUserId: number, currentUserRole: UserRole) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException('任务不存在');
    }

    // 权限检查：非管理员只能删除自己创建的任务
    if (currentUserRole !== UserRole.ADMIN && existingTask.creatorId !== currentUserId) {
      throw new ForbiddenException('没有权限删除此任务');
    }

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: '任务删除成功' };
  }

  async getStats(userId?: number) {
    const where = userId ? { assigneeId: userId } : {};

    const [total, todo, inProgress, completed] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.count({ where: { ...where, status: 'TODO' } }),
      this.prisma.task.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      this.prisma.task.count({ where: { ...where, status: 'COMPLETED' } }),
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      todo,
      inProgress,
      completed,
      completionRate,
    };
  }

  async getComments(taskId: number, currentUserId: number, currentUserRole: UserRole) {
    // 首先检查任务是否存在，以及用户是否有权限查看该任务
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    // 权限检查：非管理员只能查看自己创建或分配给自己的任务的评论
    if (
      currentUserRole !== UserRole.ADMIN &&
      task.creatorId !== currentUserId &&
      task.assigneeId !== currentUserId
    ) {
      throw new ForbiddenException('没有权限查看此任务的评论');
    }

    return await this.prisma.taskComment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addComment(taskId: number, createTaskCommentDto: CreateTaskCommentDto, currentUserId: number, currentUserRole: UserRole) {
    // 首先检查任务是否存在，以及用户是否有权限为该任务添加评论
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    // 权限检查：非管理员只能为自己创建或分配给自己的任务添加评论
    if (
      currentUserRole !== UserRole.ADMIN &&
      task.creatorId !== currentUserId &&
      task.assigneeId !== currentUserId
    ) {
      throw new ForbiddenException('没有权限为此任务添加评论');
    }

    return await this.prisma.taskComment.create({
      data: {
        content: createTaskCommentDto.content,
        taskId,
        userId: currentUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
    });
  }

  async deleteComment(taskId: number, commentId: number, currentUserId: number, currentUserRole: UserRole) {
    // 首先检查评论是否存在
    const comment = await this.prisma.taskComment.findUnique({
      where: { id: commentId },
      include: {
        task: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 检查评论是否属于指定的任务
    if (comment.taskId !== taskId) {
      throw new BadRequestException('评论不属于指定任务');
    }

    // 权限检查：管理员可以删除任何评论，其他用户只能删除自己的评论
    if (currentUserRole !== UserRole.ADMIN && comment.userId !== currentUserId) {
      throw new ForbiddenException('没有权限删除此评论');
    }

    await this.prisma.taskComment.delete({
      where: { id: commentId },
    });

    return { message: '评论删除成功' };
  }
}