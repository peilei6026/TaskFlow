import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../types/enums';

@Injectable()
export class QuadrantService {
  constructor(private prisma: PrismaService) {}

  async getAnalysis(userId: number, userRole: UserRole) {
    // 根据用户权限确定查询范围
    const whereClause = userRole === UserRole.ADMIN
      ? {} // 管理员可以查看所有任务
      : {
          OR: [
            { creatorId: userId },
            { assigneeId: userId },
          ],
        };

    // 获取所有符合条件的任务
    const tasks = await this.prisma.task.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
    });

    // 四象限分类逻辑
    const quadrants = {
      urgent_important: [], // 象限1：紧急且重要
      not_urgent_important: [], // 象限2：不紧急但重要
      urgent_not_important: [], // 象限3：紧急但不重要
      not_urgent_not_important: [], // 象限4：不紧急且不重要
    };

    const now = new Date();

    tasks.forEach((task) => {
      const isUrgent = this.isTaskUrgent(task, now);
      const isImportant = this.isTaskImportant(task);

      if (isUrgent && isImportant) {
        quadrants.urgent_important.push(task);
      } else if (!isUrgent && isImportant) {
        quadrants.not_urgent_important.push(task);
      } else if (isUrgent && !isImportant) {
        quadrants.urgent_not_important.push(task);
      } else {
        quadrants.not_urgent_not_important.push(task);
      }
    });

    // 计算统计数据
    const stats = {
      total: tasks.length,
      urgent_important: quadrants.urgent_important.length,
      not_urgent_important: quadrants.not_urgent_important.length,
      urgent_not_important: quadrants.urgent_not_important.length,
      not_urgent_not_important: quadrants.not_urgent_not_important.length,
      distribution: {
        urgent_important_percent: this.calculatePercentage(quadrants.urgent_important.length, tasks.length),
        not_urgent_important_percent: this.calculatePercentage(quadrants.not_urgent_important.length, tasks.length),
        urgent_not_important_percent: this.calculatePercentage(quadrants.urgent_not_important.length, tasks.length),
        not_urgent_not_important_percent: this.calculatePercentage(quadrants.not_urgent_not_important.length, tasks.length),
      },
    };

    // 生成建议
    const recommendations = this.generateRecommendations(stats);

    return {
      quadrants,
      stats,
      recommendations,
    };
  }

  async getTasksByQuadrant(quadrant: string, userId: number, userRole: UserRole) {
    const whereClause = userRole === UserRole.ADMIN
      ? {}
      : {
          OR: [
            { creatorId: userId },
            { assigneeId: userId },
          ],
        };

    const tasks = await this.prisma.task.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
    });

    const now = new Date();
    const filteredTasks = tasks.filter((task) => {
      const isUrgent = this.isTaskUrgent(task, now);
      const isImportant = this.isTaskImportant(task);

      switch (quadrant) {
        case 'urgent_important':
          return isUrgent && isImportant;
        case 'not_urgent_important':
          return !isUrgent && isImportant;
        case 'urgent_not_important':
          return isUrgent && !isImportant;
        case 'not_urgent_not_important':
          return !isUrgent && !isImportant;
        default:
          return false;
      }
    });

    return filteredTasks;
  }

  private isTaskUrgent(task: any, now: Date): boolean {
    // 紧急性判断逻辑
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    // 如果截止日期在3天内，或者已经过期，则视为紧急
    return daysDiff <= 3;
  }

  private isTaskImportant(task: any): boolean {
    // 重要性判断逻辑
    // 1. 高优先级任务
    if (task.priority === 'HIGH') return true;

    // 2. 有标签标识为重要的任务
    if (task.tags) {
      const tags = JSON.parse(task.tags);
      const importantTags = ['重要', 'important', '核心', 'critical', '关键'];
      if (tags.some((tag: string) => importantTags.includes(tag.toLowerCase()))) {
        return true;
      }
    }

    // 3. 标题或描述包含重要关键词
    const importantKeywords = ['关键', '重要', '核心', '紧急', 'critical', 'important', 'key'];
    const titleAndDesc = (task.title + ' ' + (task.description || '')).toLowerCase();
    if (importantKeywords.some(keyword => titleAndDesc.includes(keyword))) {
      return true;
    }

    // 4. 中等优先级且有描述的任务可能比较重要
    if (task.priority === 'MEDIUM' && task.description && task.description.length > 50) {
      return true;
    }

    return false;
  }

  private calculatePercentage(count: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }

  private generateRecommendations(stats: any): string[] {
    const recommendations = [];

    // 基于象限分布给出建议
    if (stats.urgent_important > 0) {
      recommendations.push(`您有 ${stats.urgent_important} 个紧急且重要的任务，建议立即处理这些任务。`);
    }

    if (stats.distribution.urgent_important_percent > 30) {
      recommendations.push('紧急重要任务占比过高，建议优化时间管理，提前规划重要任务。');
    }

    if (stats.distribution.not_urgent_important_percent < 20) {
      recommendations.push('重要但不紧急的任务较少，建议增加长期规划和战略性任务。');
    }

    if (stats.distribution.urgent_not_important_percent > 25) {
      recommendations.push('紧急但不重要的任务较多，考虑委派或简化这些任务。');
    }

    if (stats.distribution.not_urgent_not_important_percent > 40) {
      recommendations.push('不紧急不重要的任务占比过高，建议减少或延后处理这些任务。');
    }

    if (recommendations.length === 0) {
      recommendations.push('您的任务分布较为合理，继续保持良好的时间管理习惯。');
    }

    return recommendations;
  }
}