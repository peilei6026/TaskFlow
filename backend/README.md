# 任务管理系统后端 API

基于 NestJS + Prisma + PostgreSQL 构建的现代化任务管理系统后端服务。

## 🚀 功能特性

- ✅ **用户认证系统**: JWT 令牌认证，支持访问令牌和刷新令牌
- ✅ **任务管理**: 完整的任务 CRUD 操作，支持状态管理和优先级设置
- ✅ **权限控制**: 基于角色的访问控制（RBAC）
- ✅ **四象限管理**: 支持任务四象限分析和拖拽操作
- ✅ **时间记录**: 工时统计和时间追踪功能
- ✅ **API 文档**: 完整的 Swagger API 文档
- ✅ **测试覆盖**: 完整的单元测试和集成测试
- ✅ **类型安全**: 全栈 TypeScript 支持

## 🛠 技术栈

- **框架**: [NestJS](https://nestjs.com/) - 企业级 Node.js 框架
- **数据库**: [PostgreSQL](https://www.postgresql.org/) - 强大的关系型数据库
- **ORM**: [Prisma](https://prisma.io/) - 现代化数据库工具包
- **认证**: JWT + bcrypt - 安全的用户认证
- **测试**: Jest + Supertest - 完整的测试框架
- **文档**: Swagger/OpenAPI - 自动生成 API 文档
- **验证**: class-validator - 数据验证
- **安全**: Helmet + CORS - 安全中间件

## 📋 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- npm >= 8.0.0

## 🔧 安装和配置

### 1. 克隆仓库

```bash
cd backend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量文件并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"

# JWT 配置
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# 服务器配置
PORT=3001
NODE_ENV="development"

# CORS 配置
CORS_ORIGIN="http://localhost:3000"
```

### 4. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 填充示例数据
npm run db:seed
```

## 🚀 启动服务

### 开发模式

```bash
npm run start:dev
```

### 生产模式

```bash
# 构建项目
npm run build

# 启动生产服务
npm run start:prod
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 监听模式运行测试
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e
```

## 📊 API 文档

启动服务后，访问 Swagger API 文档：

- **开发环境**: http://localhost:3001/api/docs
- **API 基础路径**: http://localhost:3001/api

## 📁 项目结构

```
src/
├── auth/                    # 认证模块
│   ├── decorators/         # 装饰器（Public, CurrentUser, Roles）
│   ├── dto/               # 数据传输对象
│   ├── guards/            # 守卫（JWT, Roles）
│   ├── strategies/        # Passport 策略
│   ├── auth.controller.ts # 认证控制器
│   ├── auth.service.ts    # 认证服务
│   └── auth.module.ts     # 认证模块
├── tasks/                  # 任务管理模块
│   ├── dto/               # 数据传输对象
│   ├── tasks.controller.ts # 任务控制器
│   ├── tasks.service.ts   # 任务服务
│   └── tasks.module.ts    # 任务模块
├── prisma/                # Prisma 配置
│   ├── prisma.service.ts  # Prisma 服务
│   └── prisma.module.ts   # Prisma 模块
├── app.module.ts          # 应用根模块
└── main.ts               # 应用入口文件

prisma/
├── schema.prisma         # 数据库模式定义
└── seed.ts              # 数据库种子文件

test/
├── setup.ts             # 测试设置文件
└── **/*.spec.ts        # 测试文件
```

## 🔐 API 认证

### 获取访问令牌

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 使用访问令牌

```bash
GET /api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 📝 主要 API 端点

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/profile` - 获取用户信息

### 任务管理

- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `GET /api/tasks/:id` - 获取任务详情
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务
- `GET /api/tasks/stats` - 获取任务统计

## 🔒 权限系统

### 用户角色

- **ADMIN**: 管理员，拥有所有权限
- **USER**: 普通用户，只能管理自己的任务

### 权限规则

- 用户只能查看和修改分配给自己或自己创建的任务
- 管理员可以查看和修改所有任务
- 只有任务创建者或管理员可以删除任务

## 🗄️ 数据库模式

### 主要数据表

- `users` - 用户信息表
- `tasks` - 任务表
- `task_comments` - 任务评论表
- `time_entries` - 时间记录表
- `calendar_events` - 日历事件表
- `refresh_tokens` - 刷新令牌表

## 🧪 测试示例

### 用户认证测试

```typescript
describe('POST /auth/login', () => {
  it('should login successfully with correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

## 📊 性能优化

- 数据库查询优化，使用索引和关联查询
- JWT 令牌缓存和刷新机制
- API 响应数据结构优化
- 分页查询支持
- 请求验证和数据转换

## 🔧 开发工具

### 数据库管理

```bash
# 打开 Prisma Studio
npm run db:studio
```

### 代码格式化

```bash
# 格式化代码
npm run format

# 代码检查
npm run lint
```

## 🚀 部署指南

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

### 环境变量配置

生产环境需要设置以下环境变量：

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-super-strong-production-secret"
NODE_ENV="production"
PORT=3001
CORS_ORIGIN="https://your-frontend-domain.com"
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙋‍♂️ 支持

如果您有任何问题或建议，请：

1. 查看 [API 文档](http://localhost:3001/api/docs)
2. 创建 [Issue](../../issues)
3. 联系开发团队

---

**快速开始**: 运行 `npm install && npm run db:migrate && npm run db:seed && npm run start:dev` 即可启动开发服务器！