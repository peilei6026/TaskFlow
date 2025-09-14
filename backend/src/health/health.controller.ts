import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('健康检查')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '系统健康检查' })
  @ApiResponse({
    status: 200,
    description: '系统状态正常',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 3600,
        database: {
          status: 'healthy',
          responseTime: 5,
        },
        memory: {
          used: '50MB',
          total: '100MB',
          percentage: 50,
        },
      },
    },
  })
  async check() {
    const startTime = Date.now();
    
    // 检查数据库连接
    const dbHealth = await this.prisma.healthCheck();
    const dbResponseTime = Date.now() - startTime;

    // 获取内存使用情况
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const memoryTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const memoryPercentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

    // 获取系统运行时间
    const uptime = Math.floor(process.uptime());

    return {
      status: dbHealth.status === 'healthy' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime,
      database: {
        status: dbHealth.status,
        responseTime: dbResponseTime,
      },
      memory: {
        used: `${memoryUsedMB}MB`,
        total: `${memoryTotalMB}MB`,
        percentage: memoryPercentage,
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: '就绪检查' })
  @ApiResponse({
    status: 200,
    description: '服务就绪',
  })
  async ready() {
    const dbHealth = await this.prisma.healthCheck();
    
    if (dbHealth.status !== 'healthy') {
      throw new Error('Database not ready');
    }

    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('live')
  @ApiOperation({ summary: '存活检查' })
  @ApiResponse({
    status: 200,
    description: '服务存活',
  })
  live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
