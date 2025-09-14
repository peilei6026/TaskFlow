import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../types/enums';

@ApiTags('任务管理')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: '创建任务' })
  @ApiResponse({
    status: 201,
    description: '任务创建成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          title: '开发新功能',
          description: '开发用户管理模块',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '2024-12-31T23:59:59.999Z',
          assigneeId: 2,
          creatorId: 1,
          tags: ['frontend', 'urgent'],
          estimatedHours: 8.5,
          actualHours: null,
          progress: 0,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          assignee: {
            id: 2,
            username: 'john',
            email: 'john@example.com',
            displayName: '李明',
            name: '李明',
          },
          creator: {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            displayName: '系统管理员',
            name: '张伟',
          },
          _count: {
            comments: 0,
            timeEntries: 0,
          },
        },
      },
    },
  })
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    const result = await this.tasksService.create(createTaskDto, user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: '获取任务列表' })
  @ApiResponse({
    status: 200,
    description: '获取任务列表成功',
    schema: {
      example: {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 50,
          totalPages: 3,
        },
      },
    },
  })
  async findAll(@Query() queryDto: QueryTasksDto, @CurrentUser() user: any) {
    const result = await this.tasksService.findAll(queryDto, user.id, user.role);
    return {
      success: true,
      ...result,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: '获取任务统计' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: '用户ID（可选，管理员可查看所有用户统计）',
  })
  @ApiResponse({
    status: 200,
    description: '获取任务统计成功',
    schema: {
      example: {
        success: true,
        data: {
          total: 10,
          todo: 3,
          inProgress: 4,
          completed: 3,
          completionRate: 30,
        },
      },
    },
  })
  async getStats(@CurrentUser() user: any, @Query('userId') userId?: string) {
    let targetUserId = undefined;

    if (userId) {
      // 只有管理员可以查看其他用户的统计
      if (user.role === UserRole.ADMIN) {
        targetUserId = parseInt(userId);
      } else if (parseInt(userId) !== user.id) {
        targetUserId = user.id; // 非管理员只能查看自己的统计
      } else {
        targetUserId = parseInt(userId);
      }
    } else {
      // 如果没有指定userId，普通用户查看自己的，管理员查看全部
      if (user.role !== UserRole.ADMIN) {
        targetUserId = user.id;
      }
    }

    const result = await this.tasksService.getStats(targetUserId);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取任务详情' })
  @ApiParam({ name: 'id', description: '任务ID' })
  @ApiResponse({
    status: 200,
    description: '获取任务详情成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          title: '开发新功能',
          description: '开发用户管理模块',
          status: 'TODO',
          priority: 'MEDIUM',
          // ... 完整的任务信息，包含评论和时间记录
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '任务不存在',
  })
  @ApiResponse({
    status: 403,
    description: '没有权限查看此任务',
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    const result = await this.tasksService.findOne(id, user.id, user.role);
    return {
      success: true,
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新任务' })
  @ApiParam({ name: 'id', description: '任务ID' })
  @ApiResponse({
    status: 200,
    description: '任务更新成功',
  })
  @ApiResponse({
    status: 404,
    description: '任务不存在',
  })
  @ApiResponse({
    status: 403,
    description: '没有权限修改此任务',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    const result = await this.tasksService.update(id, updateTaskDto, user.id, user.role);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除任务' })
  @ApiParam({ name: 'id', description: '任务ID' })
  @ApiResponse({
    status: 200,
    description: '任务删除成功',
  })
  @ApiResponse({
    status: 404,
    description: '任务不存在',
  })
  @ApiResponse({
    status: 403,
    description: '没有权限删除此任务',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    const result = await this.tasksService.remove(id, user.id, user.role);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '获取任务评论列表' })
  @ApiParam({ name: 'id', description: '任务ID' })
  @ApiResponse({
    status: 200,
    description: '获取评论列表成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            content: '这个任务很重要，需要优先处理',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            user: {
              id: 1,
              name: '张伟',
              email: 'admin@example.com',
              displayName: '系统管理员',
            },
          },
        ],
      },
    },
  })
  async getComments(@Param('id', ParseIntPipe) taskId: number, @CurrentUser() user: any) {
    const result = await this.tasksService.getComments(taskId, user.id, user.role);
    return {
      success: true,
      data: result,
    };
  }

  @Post(':id/comments')
  @ApiOperation({ summary: '为任务添加评论' })
  @ApiParam({ name: 'id', description: '任务ID' })
  @ApiResponse({
    status: 201,
    description: '评论添加成功',
  })
  async addComment(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() createTaskCommentDto: CreateTaskCommentDto,
    @CurrentUser() user: any,
  ) {
    const result = await this.tasksService.addComment(taskId, createTaskCommentDto, user.id, user.role);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':taskId/comments/:commentId')
  @ApiOperation({ summary: '删除任务评论' })
  @ApiParam({ name: 'taskId', description: '任务ID' })
  @ApiParam({ name: 'commentId', description: '评论ID' })
  @ApiResponse({
    status: 200,
    description: '评论删除成功',
  })
  async deleteComment(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: any,
  ) {
    const result = await this.tasksService.deleteComment(taskId, commentId, user.id, user.role);
    return {
      success: true,
      data: result,
    };
  }
}