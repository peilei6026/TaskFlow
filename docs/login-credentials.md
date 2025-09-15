# 🔐 系统登录凭据

## 📋 测试账户

> **重要提示：** 所有测试账户的密码都是 `password123`

### 管理员账户
- **邮箱：** `admin@example.com`
- **密码：** `password123`
- **权限：** 完整系统管理权限
- **角色：** 系统管理员
- **姓名：** 张伟

### 开发者账户
- **邮箱：** `john@example.com`
- **密码：** `password123`
- **权限：** 基础用户权限
- **角色：** 前端开发工程师
- **姓名：** 李明

### 测试员账户
- **邮箱：** `test@example.com`
- **密码：** `password123`
- **权限：** 基础用户权限
- **角色：** 测试工程师
- **姓名：** 王芳

## 🚨 登录问题排查

### 常见问题及解决方案

#### 1. "邮箱或密码错误"
**可能原因：**
- ❌ 使用了错误的密码 (`password` 而非 `password123`)
- ❌ 邮箱地址输入错误
- ❌ 后端服务未启动

**解决方案：**
- ✅ 确认密码为：`password123`
- ✅ 检查邮箱拼写是否正确
- ✅ 确保后端服务运行在端口 3002

#### 2. "网络连接错误"
**可能原因：**
- ❌ 后端服务未启动
- ❌ 端口被占用
- ❌ 代理配置错误

**解决方案：**
```bash
# 检查后端服务状态
curl http://localhost:3002/api/health

# 启动后端服务
cd backend
npm run start:dev

# 检查端口占用
lsof -i :3002
```

#### 3. "登录后页面不跳转"
**可能原因：**
- ❌ 前端路由配置问题
- ❌ 认证状态未正确保存

**解决方案：**
- ✅ 清除浏览器缓存和 localStorage
- ✅ 检查浏览器控制台错误信息
- ✅ 重新启动前端服务

## 🔧 快速验证步骤

### 1. 验证后端服务
```bash
# 测试健康检查接口
curl http://localhost:3002/api/health

# 测试登录接口
curl -X POST "http://localhost:3002/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

### 2. 验证前端连接
1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签
3. 尝试登录
4. 检查是否有对 `/api/auth/login` 的请求
5. 查看请求和响应内容

### 3. 重置系统状态
如果遇到持续问题，可以重置系统：

```bash
# 重新生成数据库
cd backend
rm prisma/dev.db
npm run db:generate
npm run db:migrate
npm run db:seed

# 重启服务
npm run start:dev
```

## 📱 移动端登录

移动端访问时请注意：
- 确保使用相同的网络
- 可能需要使用电脑的IP地址而非localhost
- 检查防火墙设置

## 🆘 紧急联系

如果以上方法都无法解决问题：
1. 检查后端日志输出
2. 查看浏览器控制台错误
3. 确认数据库文件存在：`backend/prisma/dev.db`
4. 联系开发团队

---

**最后更新：** 2025-09-14
**状态：** ✅ 已验证可用