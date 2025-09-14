# 后端启动指南

## 1. 概述

本文档将指导您如何在本地环境中启动和运行任务管理系统的后端服务。该后端基于 NestJS 框架开发，使用 SQLite 数据库。

## 2. 系统要求

### 2.1 软件要求
- **Node.js**: 版本 18.x 或更高
- **npm**: 版本 9.x 或更高 (随 Node.js 安装)
- **Git**: 用于代码管理

### 2.2 推荐开发工具
- **Visual Studio Code**: 代码编辑器
- **Postman/Insomnia**: API 测试工具
- **SQLite Browser**: 数据库查看工具

## 3. 环境安装

### 3.1 安装 Node.js

#### Windows 系统
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本
3. 运行安装程序并按照提示安装
4. 验证安装：
```bash
node --version
npm --version
```

#### macOS 系统
```bash
# 使用 Homebrew 安装
brew install node

# 或者下载官方安装包
# 访问 https://nodejs.org/ 下载安装
```

#### Linux 系统
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 3.2 验证安装
```bash
node --version
# 应该输出 v18.x.x 或更高版本

npm --version
# 应该输出 9.x.x 或更高版本
```

## 4. 项目设置

### 4.1 克隆项目（如果适用）
```bash
git clone <repository-url>
cd wind202095/backend
```

### 4.2 安装依赖
```bash
npm install
```

如果遇到网络问题，可以使用淘宝镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

### 4.3 项目目录结构
```
backend/
├── src/                    # 源代码目录
│   ├── app.module.ts       # 根模块
│   ├── main.ts             # 应用入口文件
│   ├── config/             # 配置文件
│   ├── common/             # 公共模块
│   ├── database/           # 数据库模块
│   └── modules/            # 业务模块
│       ├── auth/           # 认证模块
│       ├── users/          # 用户模块
│       └── tasks/          # 任务模块
├── test/                   # 测试文件
├── data/                   # SQLite 数据库文件
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 配置
├── nest-cli.json           # NestJS CLI 配置
└── .env                    # 环境变量配置
```

## 5. 环境配置

### 5.1 创建环境变量文件
在 `backend` 目录下创建 `.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
DATABASE_PATH=data/task_manager.db

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 应用配置
APP_NAME="任务管理系统"
APP_VERSION=1.0.0

# CORS 配置
CORS_ORIGIN=http://localhost:5173

# 日志配置
LOG_LEVEL=debug
```

### 5.2 环境变量说明

| 变量名 | 说明 | 默认值 | 是否必需 |
|--------|------|--------|----------|
| NODE_ENV | 运行环境 | development | 否 |
| PORT | 服务端口 | 3000 | 否 |
| DATABASE_PATH | SQLite 数据库文件路径 | data/task_manager.db | 否 |
| JWT_SECRET | JWT 密钥 | - | 是 |
| JWT_EXPIRES_IN | JWT 访问令牌过期时间 | 15m | 否 |
| JWT_REFRESH_EXPIRES_IN | JWT 刷新令牌过期时间 | 7d | 否 |
| CORS_ORIGIN | 允许的跨域来源 | * | 否 |

### 5.3 生成安全的 JWT 密钥
```bash
# 使用 Node.js 生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或者使用 OpenSSL
openssl rand -hex 32
```

## 6. 数据库设置

### 6.1 数据库初始化
应用启动时会自动创建 SQLite 数据库文件和表结构。

### 6.2 手动创建数据目录
```bash
mkdir -p data
```

### 6.3 数据库文件位置
- 开发环境：`backend/data/task_manager.db`
- 生产环境：根据 `DATABASE_PATH` 环境变量

### 6.4 初始化数据（可选）
如果需要初始化示例数据，可以创建种子脚本：

```bash
# 创建管理员用户
npm run seed:admin
```

## 7. 启动应用

### 7.1 开发模式启动
```bash
# 启动开发服务器（带热重载）
npm run start:dev

# 或者使用 yarn
yarn start:dev
```

### 7.2 生产模式启动
```bash
# 构建应用
npm run build

# 启动生产服务器
npm run start:prod
```

### 7.3 调试模式启动
```bash
# 启动调试模式
npm run start:debug
```

### 7.4 启动成功验证
应用启动成功后，您应该看到类似以下的输出：

```
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized +20ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [InstanceLoader] DatabaseModule dependencies initialized +5ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [InstanceLoader] ConfigModule dependencies initialized +1ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [InstanceLoader] AuthModule dependencies initialized +10ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [InstanceLoader] UsersModule dependencies initialized +5ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [InstanceLoader] TasksModule dependencies initialized +5ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [RoutesResolver] AuthController {/api/auth}: +15ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [RouterExplorer] Mapped {/api/auth/login, POST} route +2ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [RouterExplorer] Mapped {/api/auth/register, POST} route +1ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [RouterExplorer] Mapped {/api/auth/refresh, POST} route +1ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [RouterExplorer] Mapped {/api/auth/logout, POST} route +1ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [RouterExplorer] Mapped {/api/auth/profile, GET} route +0ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG [NestApplication] Nest application successfully started +5ms
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG Application running on: http://localhost:3000
[Nest] 12345  - 2024/01/01, 10:00:00 AM     LOG Swagger documentation available at: http://localhost:3000/api/docs
```

## 8. 验证安装

### 8.1 健康检查
```bash
curl http://localhost:3000/health
```

预期响应：
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

### 8.2 API 文档访问
访问 Swagger 文档：
```
http://localhost:3000/api/docs
```

### 8.3 测试基础 API
```bash
# 测试用户注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456",
    "displayName": "测试用户"
  }'

# 测试用户登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

## 9. 常用命令

### 9.1 NPM 脚本命令
```bash
# 启动开发服务器
npm run start:dev

# 构建应用
npm run build

# 启动生产服务器
npm run start:prod

# 运行测试
npm run test

# 运行端到端测试
npm run test:e2e

# 代码格式化
npm run format

# 代码检查
npm run lint

# 代码检查并修复
npm run lint:fix
```

### 9.2 数据库命令
```bash
# 生成数据库迁移
npm run migration:generate -- -n MigrationName

# 运行数据库迁移
npm run migration:run

# 回滚数据库迁移
npm run migration:revert

# 删除数据库（小心使用）
npm run db:drop
```

### 9.3 代码生成命令
```bash
# 生成模块
nest generate module module-name

# 生成控制器
nest generate controller controller-name

# 生成服务
nest generate service service-name

# 生成完整资源（模块、控制器、服务、DTO 等）
nest generate resource resource-name
```

## 10. 故障排除

### 10.1 常见问题

#### 问题 1: 端口被占用
**错误信息**: `EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000

# 或者在 Windows 上
netstat -ano | findstr :3000

# 杀死进程
kill -9 <PID>

# 或者修改端口
PORT=3001 npm run start:dev
```

#### 问题 2: 依赖安装失败
**错误信息**: `npm ERR! network request failed`

**解决方案**:
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 和重新安装
rm -rf node_modules package-lock.json
npm install

# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com
```

#### 问题 3: TypeScript 编译错误
**解决方案**:
```bash
# 检查 TypeScript 版本
npx tsc --version

# 重新构建
npm run build

# 检查 tsconfig.json 配置
```

#### 问题 4: 数据库连接失败
**解决方案**:
1. 检查 `data` 目录是否存在
2. 检查 `DATABASE_PATH` 环境变量
3. 确保有写入权限
```bash
mkdir -p data
chmod 755 data
```

#### 问题 5: JWT 错误
**错误信息**: `JsonWebTokenError: invalid signature`

**解决方案**:
1. 检查 `JWT_SECRET` 环境变量是否设置
2. 确保客户端和服务端使用相同的密钥
3. 重新生成 JWT 密钥

### 10.2 调试技巧

#### 启用详细日志
```bash
LOG_LEVEL=debug npm run start:dev
```

#### 使用 Node.js 调试器
```bash
npm run start:debug
```

然后在 VS Code 中连接调试器。

#### 数据库调试
```bash
# 查看 SQLite 数据库内容
sqlite3 data/task_manager.db
.tables
.schema users
SELECT * FROM users;
```

### 10.3 性能监控

#### 查看应用进程
```bash
# 查看 Node.js 进程
ps aux | grep node

# 查看内存使用
top -p <PID>
```

#### 监控应用健康状态
```bash
# 持续监控健康检查端点
watch -n 5 curl -s http://localhost:3000/health
```

## 11. 开发工具推荐

### 11.1 VS Code 扩展
- **NestJS Files**: NestJS 文件生成器
- **TypeScript Importer**: 自动导入 TypeScript 模块
- **Prettier**: 代码格式化
- **ESLint**: 代码检查
- **REST Client**: API 测试
- **SQLite Viewer**: 查看 SQLite 数据库

### 11.2 API 测试工具
- **Postman**: 功能强大的 API 测试工具
- **Insomnia**: 轻量级 API 测试工具
- **Thunder Client**: VS Code 内置的 API 测试扩展

### 11.3 数据库工具
- **DB Browser for SQLite**: SQLite 数据库管理工具
- **DBeaver**: 通用数据库管理工具

## 12. 部署前准备

### 12.1 生产环境配置
```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/var/lib/taskmanager/task_manager.db
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

### 12.2 安全检查清单
- [ ] 修改默认的 JWT 密钥
- [ ] 设置强密码策略
- [ ] 配置 CORS 白名单
- [ ] 启用 HTTPS
- [ ] 设置适当的日志级别
- [ ] 配置防火墙规则

### 12.3 性能优化
- [ ] 启用 gzip 压缩
- [ ] 配置缓存策略
- [ ] 设置连接池大小
- [ ] 优化数据库查询
- [ ] 启用 PM2 进程管理

## 13. 维护和监控

### 13.1 日志管理
```bash
# 查看应用日志
tail -f logs/application.log

# 按日期查看错误日志
grep "2024-01-01" logs/error.log
```

### 13.2 备份策略
```bash
# 备份数据库
cp data/task_manager.db backups/task_manager_$(date +%Y%m%d_%H%M%S).db

# 自动备份脚本
#!/bin/bash
BACKUP_DIR="backups"
DB_FILE="data/task_manager.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_FILE $BACKUP_DIR/task_manager_$DATE.db

# 保留最近 30 天的备份
find $BACKUP_DIR -name "task_manager_*.db" -mtime +30 -delete
```

### 13.3 更新和升级
```bash
# 检查过时的依赖
npm outdated

# 更新依赖
npm update

# 安全审计
npm audit

# 修复安全漏洞
npm audit fix
```

## 14. 支持和帮助

### 14.1 文档资源
- [NestJS 官方文档](https://docs.nestjs.com/)
- [TypeORM 文档](https://typeorm.io/)
- [Node.js 文档](https://nodejs.org/docs/)

### 14.2 社区支持
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nestjs)
- [GitHub Issues](https://github.com/nestjs/nest/issues)

### 14.3 联系方式
- **技术支持**: support@taskmanager.com
- **开发团队**: dev@taskmanager.com
- **问题反馈**: issues@taskmanager.com

---

*本文档将持续更新，以反映最新的项目状态和最佳实践。如有疑问或建议，请联系开发团队。*