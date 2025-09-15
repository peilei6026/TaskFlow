# 故障排除指南

## 🚨 常见问题解决

### 数据库连接问题

**问题：** `Error: Can't reach database server`

**解决方案：**
```bash
# 1. 检查数据库是否启动
sudo systemctl status postgresql
# 或 Docker 方式
docker ps | grep postgres

# 2. 检查连接配置
cat .env | grep DATABASE_URL

# 3. 测试连接
npx prisma db ping
```

**问题：** `Migration failed`

**解决方案：**
```bash
# 1. 重置数据库
npx prisma migrate reset

# 2. 重新生成客户端
npx prisma generate

# 3. 重新执行迁移
npx prisma migrate dev
```

### 认证问题

**问题：** `Unauthorized` 错误

**解决方案：**
```bash
# 1. 检查 JWT 密钥配置
echo $JWT_SECRET

# 2. 验证令牌是否过期
# 在前端检查 localStorage 中的 token

# 3. 检查请求头格式
# Authorization: Bearer <token>
```

**问题：** 刷新令牌失败

**解决方案：**
```bash
# 1. 清理过期的刷新令牌
npx prisma studio
# 手动删除过期的 refresh_tokens

# 2. 检查令牌过期时间配置
grep JWT_REFRESH_EXPIRES_IN .env
```

### 测试问题

**问题：** Jest 配置冲突

**解决方案：**
```bash
# 1. 删除重复的配置文件
rm jest.config.js
# 或者删除 package.json 中的 jest 配置

# 2. 使用指定配置运行
npm test -- --config=jest.config.js
```

**问题：** 测试数据库连接失败

**解决方案：**
```bash
# 1. 创建测试环境配置
cp .env .env.test

# 2. 修改测试数据库 URL
DATABASE_URL="postgresql://username:password@localhost:5432/test_db"

# 3. 初始化测试数据库
NODE_ENV=test npx prisma migrate deploy
```

### 构建问题

**问题：** TypeScript 编译错误

**解决方案：**
```bash
# 1. 清理编译缓存
rm -rf dist/
rm -rf node_modules/.cache/

# 2. 重新安装依赖
rm -rf node_modules/
rm package-lock.json
npm install

# 3. 检查 TypeScript 版本兼容性
npm list typescript
```

**问题：** Prisma 客户端过时

**解决方案：**
```bash
# 1. 重新生成客户端
npx prisma generate

# 2. 重启开发服务器
npm run start:dev
```

### 性能问题

**问题：** 数据库查询缓慢

**解决方案：**
```sql
-- 1. 检查查询执行计划
EXPLAIN ANALYZE SELECT * FROM tasks WHERE assigneeId = 1;

-- 2. 添加适当的索引
CREATE INDEX idx_tasks_assigneeId ON tasks(assigneeId);
CREATE INDEX idx_tasks_status ON tasks(status);
```

**问题：** 内存使用过高

**解决方案：**
```bash
# 1. 监控内存使用
NODE_OPTIONS="--max-old-space-size=4096" npm run start:dev

# 2. 检查内存泄漏
npm install -g clinic
clinic doctor -- node dist/main.js
```

### 开发环境问题

**问题：** 热重载不工作

**解决方案：**
```bash
# 1. 检查文件监听
npm run start:dev -- --watch

# 2. 增加文件监听限制
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**问题：** 端口占用

**解决方案：**
```bash
# 1. 查找占用端口的进程
lsof -i :3001

# 2. 终止进程
kill -9 <PID>

# 3. 或者更换端口
PORT=3002 npm run start:dev
```

## 🔍 调试工具

### 日志调试

```bash
# 开启详细日志
DEBUG=* npm run start:dev

# Prisma 查询日志
DEBUG=prisma:query npm run start:dev

# NestJS 日志级别
LOG_LEVEL=debug npm run start:dev
```

### 数据库调试

```bash
# 打开 Prisma Studio
npx prisma studio

# 查看数据库架构
npx prisma db pull

# 验证数据库状态
npx prisma migrate status
```

### API 调试

```bash
# 使用 curl 测试 API
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# 使用 httpie (更简洁)
http POST localhost:3001/api/auth/login email=admin@example.com password=password
```

## 📞 获取帮助

### 社区资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [Prisma 文档](https://www.prisma.io/docs/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nestjs)

### 项目相关

- 查看项目 Issues
- 联系开发团队
- 查阅 API 文档

### 紧急情况处理

1. **生产环境问题**
   - 立即回滚到稳定版本
   - 检查服务器日志
   - 通知相关人员

2. **数据丢失风险**
   - 立即停止相关服务
   - 备份当前数据
   - 联系数据库管理员