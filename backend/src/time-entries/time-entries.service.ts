import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto/time-entries.dto';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    taskId?: number;
    userId?: number;
    startDate?: string;
    endDate?: string;
    currentUserId: number;
  }) {
    const { page = 1, limit = 10, taskId, userId, startDate, endDate, currentUserId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    // 普通用户只能查看自己的时间记录
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (currentUser?.role !== 'admin') {
      where.userId = currentUserId;
    } else if (userId) {
      where.userId = userId;
    }

    if (taskId) {
      where.taskId = taskId;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [timeEntries, total] = await Promise.all([
      this.prisma.timeEntry.findMany({
        where,
        include: {
          task: {
            select: {
              id: true,
              title: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.timeEntry.count({ where }),
    ]);

    return {
      success: true,
      data: {
        timeEntries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getStats(params: {
    userId?: number;
    startDate?: string;
    endDate?: string;
    currentUserId: number;
  }) {
    const { userId, startDate, endDate, currentUserId } = params;

    // 权限检查
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    const targetUserId = userId || currentUserId;

    if (currentUser?.role !== 'admin' && targetUserId !== currentUserId) {
      throw new ForbiddenException('无权限查看其他用户的统计数据');
    }

    const where: any = {
      userId: targetUserId,
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const timeEntries = await this.prisma.timeEntry.findMany({
      where,
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // 计算统计数据
    const totalHours = timeEntries.reduce((sum, entry) => {
      return sum + entry.hours;
    }, 0);

    const taskStats = timeEntries.reduce((acc, entry) => {
      if (entry.task) {
        const hours = entry.hours;
        const taskId = entry.task.id;
        const taskTitle = entry.task.title;

        if (!acc[taskId]) {
          acc[taskId] = {
            taskId,
            taskTitle,
            hours: 0,
            entries: 0,
          };
        }

        acc[taskId].hours += hours;
        acc[taskId].entries += 1;
      }
      return acc;
    }, {});

    return {
      success: true,
      data: {
        totalHours: Math.round(totalHours * 100) / 100,
        totalEntries: timeEntries.length,
        taskStats: Object.values(taskStats),
      },
    };
  }

  async findById(id: number, currentUserId: number) {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    if (!timeEntry) {
      throw new NotFoundException('时间记录不存在');
    }

    // 权限检查
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (currentUser?.role !== 'admin' && timeEntry.userId !== currentUserId) {
      throw new ForbiddenException('无权限查看此时间记录');
    }

    return {
      success: true,
      data: timeEntry,
    };
  }

  async create(createTimeEntryDto: CreateTimeEntryDto, currentUserId: number) {
    const timeEntry = await this.prisma.timeEntry.create({
      data: {
        ...createTimeEntryDto,
        userId: currentUserId,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: timeEntry,
    };
  }

  async update(id: number, updateTimeEntryDto: UpdateTimeEntryDto, currentUserId: number) {
    const existingEntry = await this.prisma.timeEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      throw new NotFoundException('时间记录不存在');
    }

    // 权限检查
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (currentUser?.role !== 'admin' && existingEntry.userId !== currentUserId) {
      throw new ForbiddenException('无权限修改此时间记录');
    }

    const timeEntry = await this.prisma.timeEntry.update({
      where: { id },
      data: updateTimeEntryDto,
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: timeEntry,
    };
  }

  async delete(id: number, currentUserId: number) {
    const existingEntry = await this.prisma.timeEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      throw new NotFoundException('时间记录不存在');
    }

    // 权限检查
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (currentUser?.role !== 'admin' && existingEntry.userId !== currentUserId) {
      throw new ForbiddenException('无权限删除此时间记录');
    }

    await this.prisma.timeEntry.delete({ where: { id } });

    return {
      success: true,
      message: '时间记录删除成功',
    };
  }
}