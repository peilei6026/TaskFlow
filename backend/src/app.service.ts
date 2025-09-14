import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: '任务管理系统',
      version: '1.0.0',
      description: '轻量级任务管理系统后端API服务',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      features: [
        '用户认证与授权',
        '任务管理(CRUD)',
        '日历视图',
        '四象限分析',
        'RESTful API',
        'Swagger文档',
        'JWT认证',
        'SQLite数据库',
      ],
      endpoints: {
        docs: '/api/docs',
        health: '/api/v1/health',
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        tasks: '/api/v1/tasks',
        calendar: '/api/v1/calendar',
        quadrant: '/api/v1/quadrant',
      },
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development',
    };
  }
}