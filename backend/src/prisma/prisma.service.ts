import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('数据库连接成功');
      
      // 测试数据库连接
      await this.$queryRaw`SELECT 1`;
      this.logger.log('数据库连接测试通过');
    } catch (error) {
      this.logger.error('数据库连接失败:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('数据库连接已关闭');
    } catch (error) {
      this.logger.error('关闭数据库连接时出错:', error);
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const models = Reflect.ownKeys(this).filter(key => key[0] !== '_');

    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }

  /**
   * 获取连接池状态
   */
  async getConnectionStatus() {
    try {
      const result = await this.$queryRaw`
        SELECT 
          COUNT(*) as active_connections,
          (SELECT COUNT(*) FROM sqlite_master WHERE type='table') as table_count
      `;
      return result[0];
    } catch (error) {
      this.logger.error('获取连接状态失败:', error);
      return null;
    }
  }
}