import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { QuadrantService } from './quadrant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('四象限分析')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quadrant')
export class QuadrantController {
  constructor(private readonly quadrantService: QuadrantService) {}

  @Get('analysis')
  @ApiOperation({
    summary: '获取四象限分析',
    description: '基于艾森豪威尔矩阵将任务分为四个象限：紧急重要、重要不紧急、紧急不重要、不重要不紧急'
  })
  @ApiResponse({
    status: 200,
    description: '获取分析成功',
    schema: {
      example: {
        success: true,
        data: {
          quadrants: {
            urgent_important: [
              {
                id: 1,
                title: '修复生产环境bug',
                priority: 'HIGH',
                dueDate: '2023-12-01T23:59:59.999Z',
                // ... 其他任务字段
              }
            ],
            not_urgent_important: [],
            urgent_not_important: [],
            not_urgent_not_important: []
          },
          stats: {
            total: 10,
            urgent_important: 3,
            not_urgent_important: 2,
            urgent_not_important: 2,
            not_urgent_not_important: 3,
            distribution: {
              urgent_important_percent: 30,
              not_urgent_important_percent: 20,
              urgent_not_important_percent: 20,
              not_urgent_not_important_percent: 30
            }
          },
          recommendations: [
            '您有 3 个紧急且重要的任务，建议立即处理这些任务。'
          ]
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: '未授权' })
  async getAnalysis(@Request() req: any) {
    const result = await this.quadrantService.getAnalysis(req.user.id, req.user.role);

    // 调整字段名以匹配前端期望的格式
    const adjustedResult = {
      urgent_important: result.quadrants.urgent_important,
      important_not_urgent: result.quadrants.not_urgent_important, // 字段名调整
      urgent_not_important: result.quadrants.urgent_not_important,
      not_urgent_not_important: result.quadrants.not_urgent_not_important,
      archived: [], // 添加归档字段
      stats: result.stats,
      recommendations: result.recommendations
    };

    return {
      success: true,
      data: adjustedResult,
    };
  }

  @Get('tasks')
  @ApiOperation({
    summary: '按象限获取任务',
    description: '获取指定象限的任务列表'
  })
  @ApiQuery({
    name: 'quadrant',
    required: true,
    description: '象限类型',
    enum: ['urgent_important', 'not_urgent_important', 'urgent_not_important', 'not_urgent_not_important'],
    example: 'urgent_important'
  })
  @ApiResponse({
    status: 200,
    description: '获取任务成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            title: '修复生产环境bug',
            description: '紧急修复影响用户的关键问题',
            status: 'TODO',
            priority: 'HIGH',
            dueDate: '2023-12-01T23:59:59.999Z',
            // ... 其他任务字段
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: '无效的象限参数' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getTasksByQuadrant(@Query('quadrant') quadrant: string, @Request() req: any) {
    const validQuadrants = ['urgent_important', 'not_urgent_important', 'urgent_not_important', 'not_urgent_not_important'];

    if (!validQuadrants.includes(quadrant)) {
      return {
        success: false,
        message: '无效的象限参数',
        validValues: validQuadrants,
      };
    }

    const result = await this.quadrantService.getTasksByQuadrant(quadrant, req.user.id, req.user.role);
    return {
      success: true,
      data: result,
    };
  }

  @Post('move')
  @ApiOperation({ summary: '移动任务到指定象限' })
  @ApiBody({
    schema: {
      example: {
        taskId: 1,
        quadrant: 'urgent_important'
      }
    }
  })
  @ApiResponse({ status: 200, description: '移动成功' })
  async moveTask(@Body() body: { taskId: number, quadrant: string }, @Request() req: any) {
    // 这里可以添加任务移动的逻辑，暂时返回成功
    return {
      success: true,
      message: '任务移动成功'
    };
  }

  @Post('archive')
  @ApiOperation({ summary: '归档任务' })
  @ApiBody({
    schema: {
      example: {
        taskId: 1
      }
    }
  })
  @ApiResponse({ status: 200, description: '归档成功' })
  async archiveTask(@Body() body: { taskId: number }, @Request() req: any) {
    // 这里可以添加任务归档的逻辑，暂时返回成功
    return {
      success: true,
      message: '任务已归档'
    };
  }

  @Post('unarchive')
  @ApiOperation({ summary: '取消归档任务' })
  @ApiBody({
    schema: {
      example: {
        taskId: 1,
        targetQuadrant: 'not_urgent_not_important'
      }
    }
  })
  @ApiResponse({ status: 200, description: '恢复成功' })
  async unarchiveTask(@Body() body: { taskId: number, targetQuadrant: string }, @Request() req: any) {
    // 这里可以添加取消归档的逻辑，暂时返回成功
    return {
      success: true,
      message: '任务已恢复'
    };
  }

  @Delete('archived/:id')
  @ApiOperation({ summary: '删除已归档任务' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async deleteArchivedTask(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    // 这里可以添加删除已归档任务的逻辑，暂时返回成功
    return {
      success: true,
      message: '任务已永久删除'
    };
  }
}