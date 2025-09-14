import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  max: number; // 最大请求次数
  message?: string;
}

@Injectable()
export class ThrottleGuard implements CanActivate {
  private readonly requests = new Map<string, { count: number; resetTime: number }>();

  // 默认配置：每分钟最多100次请求
  private readonly defaultConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1分钟
    max: 100,
    message: '请求过于频繁，请稍后再试',
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientId = this.getClientId(request);
    const config = this.getConfigForRoute(request);

    const now = Date.now();
    const key = `${clientId}:${request.route?.path || request.path}`;
    
    const current = this.requests.get(key);

    if (!current || now > current.resetTime) {
      // 新的时间窗口
      this.requests.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    if (current.count >= config.max) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: config.message,
            timestamp: new Date().toISOString(),
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count++;
    return true;
  }

  private getClientId(request: Request): string {
    // 优先使用用户ID，其次使用IP地址
    const userId = (request as any).user?.id;
    if (userId) {
      return `user:${userId}`;
    }
    
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    return `ip:${ip}`;
  }

  private getConfigForRoute(request: Request): RateLimitConfig {
    const path = request.route?.path || request.path;
    
    // 登录接口更合理的限制
    if (path.includes('/auth/login') || path.includes('/auth/register')) {
      return {
        windowMs: 5 * 60 * 1000, // 5分钟
        max: 10, // 最多10次尝试
        message: '登录尝试过于频繁，请5分钟后再试',
      };
    }

    // API接口通用限制
    if (path.startsWith('/api/')) {
      return {
        windowMs: 60 * 1000, // 1分钟
        max: 100, // 最多100次请求
        message: 'API请求过于频繁，请稍后再试',
      };
    }

    return this.defaultConfig;
  }

  // 清理过期记录
  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  // 定期清理（可以设置定时器）
  constructor() {
    setInterval(() => this.cleanup(), 5 * 60 * 1000); // 每5分钟清理一次
  }
}
