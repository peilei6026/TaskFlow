import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { validateSecurityConfig } from './common/config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 验证安全配置
  try {
    const config = {
      NODE_ENV: configService.get('NODE_ENV'),
      JWT_SECRET: configService.get('JWT_SECRET'),
      DATABASE_URL: configService.get('DATABASE_URL'),
      CORS_ORIGIN: configService.get('CORS_ORIGIN'),
    };
    validateSecurityConfig(config as any);
    logger.log('安全配置验证通过');
  } catch (error) {
    logger.error('安全配置验证失败:', error.message);
    process.exit(1);
  }

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 安全中间件
  app.use(helmet());
  app.use(compression());

  // CORS配置
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 全局路由前缀
  app.setGlobalPrefix('api');

  // Swagger API文档
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('任务管理系统 API')
      .setDescription('轻量级任务管理系统的RESTful API文档')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('auth', '用户认证')
      .addTag('users', '用户管理')
      .addTag('tasks', '任务管理')
      .addTag('calendar', '日历功能')
      .addTag('quadrant', '四象限分析')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log('📚 API文档地址: http://localhost:3000/api/docs');
  }

  const port = configService.get('PORT') || 3001;
  await app.listen(port);

  logger.log(`🚀 任务管理系统后端服务启动成功在端口 ${port}`);
  logger.log(`🌐 服务地址: http://localhost:${port}`);
  logger.log(`📚 API 文档地址: http://localhost:${port}/api/docs`);
  logger.log(`🌍 环境: ${configService.get('NODE_ENV') || 'development'}`);
}

bootstrap().catch((error) => {
  Logger.error('应用程序启动失败', error);
  process.exit(1);
});