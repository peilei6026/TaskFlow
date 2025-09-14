# 任务管理系统

> 基于 React + NestJS 的现代化任务管理系统

## 📊 项目状态

**当前版本：** v1.0.0-beta
**开发状态：** 🚧 开发中（不可用于生产环境）
**产品成熟度：** 60/100

⚠️ **重要提示：** 系统仍处于开发阶段，存在安全性和稳定性问题，不建议用于生产环境。

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐
│   前端 React    │────│  后端 NestJS    │
│   Port: 3000    │    │   Port: 3002    │
└─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │  SQLite 数据库   │
                       │  (开发环境)      │
                       └─────────────────┘
```

## ✨ 已实现功能

- ✅ **用户认证系统**：登录、注册、权限控制
- ✅ **任务管理**：创建、编辑、删除任务
- ✅ **四象限分析**：基于艾森豪威尔矩阵的任务分类
- ✅ **数据可视化**：任务统计和图表展示
- ✅ **响应式设计**：支持桌面和移动设备
- ✅ **前后端分离**：React + NestJS 架构

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 13.0 (生产环境推荐)

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd wind202095
   ```

2. **安装依赖**
   ```bash
   # 安装前端依赖
   npm install

   # 安装后端依赖
   cd backend
   npm install
   cd ..
   ```

3. **配置环境**
   ```bash
   # 配置后端环境变量
   cp backend/.env.example backend/.env
   # 编辑 backend/.env 文件，设置数据库等配置

   # 初始化数据库
   cd backend
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   cd ..
   ```

4. **启动服务**

   **方式一：分别启动**
   ```bash
   # 启动后端服务 (终端1)
   npm run backend

   # 启动前端服务 (终端2)
   npm run frontend
   ```

   **方式二：一键启动**
   ```bash
   npm run start:fullstack
   ```

5. **访问系统**
   - 前端：http://localhost:3000
   - 后端API：http://localhost:3002/api
   - API文档：http://localhost:3002/api/docs

### 测试账户

- **管理员**：admin@example.com / password123
- **开发者**：john@example.com / password123
- **测试员**：test@example.com / password123

> 详细登录信息请查看：[登录凭据文档](./LOGIN_CREDENTIALS.md)

## 📁 项目结构

```
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   ├── pages/             # 页面组件
│   ├── services/          # API 服务
│   ├── context/           # React Context
│   └── hooks/             # 自定义 Hooks
├── backend/               # 后端源码
│   ├── src/               # NestJS 源码
│   ├── prisma/            # 数据库模型和迁移
│   └── test/              # 测试文件
├── docs/                  # 项目文档
└── scripts/               # 部署脚本
```

## 🛠️ 开发指南

### 前端开发
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm test             # 运行测试
```

### 后端开发
```bash
cd backend
npm run start:dev    # 启动开发服务器
npm run build        # 构建生产版本
npm test             # 运行测试
npm run db:studio    # 打开数据库管理界面
```

## 📈 生产就绪计划

当前系统距离生产就绪还需要完成以下工作：

### Phase 1: 安全和稳定性 (4-6周)
- [ ] 数据库迁移到PostgreSQL
- [ ] 安全加固和审计
- [ ] 错误处理优化
- [ ] 基础监控实施

### Phase 2: 用户体验优化 (3-4周)
- [ ] 移动端体验完善
- [ ] 性能优化
- [ ] 加载状态改进

### Phase 3: 功能完善 (6-8周)
- [ ] 高级协作功能
- [ ] 通知系统
- [ ] 数据分析和导出

详细计划请查看：[生产就绪评估报告](./PRODUCT_READINESS_ASSESSMENT.md)

## 📋 任务清单

开发团队待办事项：[生产就绪检查清单](./PRODUCTION_READINESS_CHECKLIST.md)

## 📖 文档

- [API 接口文档](./API_DOCUMENTATION.md)
- [后端开发指南](./backend/README.md)
- [产品需求文档](./QUADRANT_FEATURES.md)
- [测试指南](./TESTING.md)

## 🔧 技术栈

### 前端
- **框架**：React 18
- **构建工具**：Vite
- **UI库**：Ant Design
- **路由**：React Router
- **HTTP客户端**：Axios
- **状态管理**：Context API

### 后端
- **框架**：NestJS
- **数据库**：SQLite (开发) / PostgreSQL (生产)
- **ORM**：Prisma
- **认证**：JWT
- **API文档**：Swagger
- **测试**：Jest

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## ⚠️ 已知问题

- JWT 使用默认密钥（生产环境必须更改）
- 缺乏完整的错误处理机制
- 移动端适配需要优化
- 性能优化待完善
- 缺乏完整的测试覆盖

## 📞 支持

如有问题或建议，请：
1. 查看[产品就绪评估报告](./PRODUCT_READINESS_ASSESSMENT.md)了解已知问题
2. 创建 Issue 报告问题
3. 联系开发团队

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

---

⚡ **注意**：本系统仍在积极开发中，请关注更新并及时同步最新代码。