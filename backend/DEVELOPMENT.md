# 后端开发指南

## 🚀 快速开始

### 环境准备

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 初始化数据库
npm run db:generate
npm run db:migrate
npm run db:seed

# 启动开发服务器
npm run start:dev
```

### 开发工作流

1. **代码格式化**
   ```bash
   npm run format  # 格式化代码
   npm run lint    # 代码检查
   ```

2. **数据库操作**
   ```bash
   npm run db:studio    # 打开数据库管理界面
   npm run db:generate  # 重新生成 Prisma 客户端
   npm run db:migrate   # 执行数据库迁移
   ```

3. **测试执行**
   ```bash
   npm test              # 运行单元测试
   npm run test:e2e      # 运行端到端测试
   npm run test:coverage # 生成测试覆盖率报告
   ```

## 📁 代码结构

### 模块组织

```
src/
├── auth/           # 认证模块
├── tasks/          # 任务管理模块
├── prisma/         # 数据库服务
├── types/          # 类型定义
├── app.module.ts   # 根模块
└── main.ts         # 应用入口
```

### 新增模块步骤

1. 创建模块目录
2. 添加 DTO（数据传输对象）
3. 创建服务类
4. 实现控制器
5. 在 `app.module.ts` 中注册

## 🛠 开发规范

### API 设计规范

- 使用 RESTful 风格
- 统一响应格式
- 适当的 HTTP 状态码
- OpenAPI/Swagger 文档

### 数据库设计

- 遵循命名规范
- 适当的索引设计
- 关联关系清晰
- 数据迁移脚本

### 错误处理

- 统一异常处理
- 有意义的错误消息
- 适当的日志记录

## 🔍 调试技巧

### 日志调试

```typescript
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(YourService.name);

this.logger.debug('调试信息');
this.logger.log('常规日志');
this.logger.warn('警告信息');
this.logger.error('错误信息');
```

### 数据库调试

```bash
# 查看生成的 SQL
DEBUG=prisma:query npm run start:dev
```

## 🧪 测试策略

### 单元测试

- 每个服务类都应有对应测试
- Mock 外部依赖
- 测试边界条件

### 集成测试

- 测试完整的 API 流程
- 使用测试数据库
- 验证数据库操作

## 🚀 部署流程

### 本地构建

```bash
npm run build
npm run start:prod
```

### Docker 部署

```bash
docker build -t task-backend .
docker run -p 3001:3001 task-backend
```

## 📊 性能优化

- 数据库查询优化
- 适当的缓存策略
- 请求响应压缩
- 静态资源 CDN

## 🔐 安全最佳实践

- 输入数据验证
- SQL 注入防护
- XSS 攻击防护
- CORS 配置
- 密码加密存储