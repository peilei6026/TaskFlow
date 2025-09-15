# Testing Documentation

## 测试套件概述

已为任务管理系统创建了全面的测试套件，确保程序的稳定运行。

## 测试覆盖范围

### 1. 组件测试 (Component Tests)
- **ErrorBoundary.test.jsx**: 测试错误边界组件的错误捕获和恢复功能
- **Tasks.test.jsx**: 测试任务页面的数据处理、用户交互和错误处理
- **Login.test.jsx**: 测试登录页面的表单验证、认证流程和错误处理

### 2. 上下文测试 (Context Tests)
- **AuthContext.test.jsx**: 测试认证上下文的状态管理和用户操作

### 3. 服务测试 (Service Tests)
- **taskService.test.js**: 测试任务服务的API调用和错误处理

## 已实现的稳定性改进

### 1. 错误边界保护
- 在App.jsx的所有路由组件周围添加了ErrorBoundary
- 防止单个组件错误导致整个应用崩溃
- 提供用户友好的错误恢复界面

### 2. 数据结构验证
- 在Tasks、Dashboard、Users组件中添加了数组验证
- 防止"Cannot read properties of undefined (reading 'map')"类型错误
- 确保在无效响应时设置默认空数组

### 3. 错误处理改进
- 所有数据获取操作都有完整的try-catch包装
- 详细的错误日志记录
- 用户友好的错误消息显示

### 4. 加载状态管理
- 改进了所有组件的loading状态处理
- 防止在数据加载期间的错误操作
- 更好的用户体验反馈

## 测试运行方式

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- ErrorBoundary.test.jsx

# 运行测试并显示覆盖率
npm run test:coverage
```

## 测试框架和工具

- **Vitest**: 现代化的测试框架
- **React Testing Library**: React组件测试
- **User Event**: 模拟用户交互
- **jsdom**: DOM模拟环境

## 防崩溃措施总结

1. **空值安全**: 所有数组操作前都进行null/undefined检查
2. **错误边界**: 捕获和处理组件级别的错误
3. **优雅降级**: 在错误情况下提供备用UI
4. **详细日志**: 便于问题诊断和修复
5. **用户反馈**: 清晰的错误和加载状态提示

这些改进确保了应用程序在各种异常情况下都能保持稳定运行，提供良好的用户体验。

---

# 集成测试成功记录

# 前后端集成成功报告

## ✅ 集成状态

**日期：** 2025年9月14日
**状态：** 🟢 成功
**前端端口：** 3000
**后端端口：** 3002

## 🔧 完成的配置

### 1. 前端配置
- ✅ 移除Mock数据依赖
- ✅ 配置API服务连接后端
- ✅ 设置Vite代理转发请求
- ✅ 创建环境变量配置

### 2. 后端配置
- ✅ NestJS服务正常启动
- ✅ CORS配置允许前端访问
- ✅ 数据库连接正常
- ✅ API接口路由注册成功

### 3. 连接验证
- ✅ 后端健康检查接口响应正常
- ✅ 前端可以通过代理访问后端API
- ✅ 数据库中有测试数据

## 🌐 服务地址

| 服务 | 地址 | 状态 |
|------|------|------|
| 前端应用 | http://localhost:3000 | 🟢 运行中 |
| 后端API | http://localhost:3002/api | 🟢 运行中 |
| API文档 | http://localhost:3002/api/docs | 🟢 可访问 |
| 健康检查 | http://localhost:3002/api/health | 🟢 正常 |

## 🔑 测试账户

系统中已有以下测试账户可用：

| 角色 | 邮箱 | 密码 | 权限 |
|------|------|------|------|
| 管理员 | admin@example.com | password | 全部权限 |
| 普通用户 | john@example.com | password | 基础权限 |
| 测试用户 | test@example.com | password | 基础权限 |

## 🚀 启动方式

### 方式一：分别启动
```bash
# 终端1：启动后端
cd backend
npm run start:dev

# 终端2：启动前端
npm run dev
```

### 方式二：一键启动
```bash
npm run start:fullstack
```

## ✅ 功能验证

### 已验证的功能
- ✅ 用户登录/注册
- ✅ 任务CRUD操作
- ✅ 数据持久化
- ✅ JWT认证
- ✅ API代理转发

### 待测试功能
- ⏳ 四象限管理
- ⏳ 时间统计
- ⏳ 用户权限控制
- ⏳ 文件上传
- ⏳ 数据导出

## 🐛 已解决问题

### 1. 连接错误
**问题：** `ECONNREFUSED` 错误，前端无法连接后端
**原因：** 后端服务未启动
**解决：** 确保后端服务在 3002 端口正常运行

### 2. CORS问题
**问题：** 跨域访问被阻止
**解决：** 修改后端 `.env` 文件中 `CORS_ORIGIN` 为 `http://localhost:3000`

### 3. 代理配置
**问题：** Vite代理路径重写错误
**解决：** 移除 `rewrite` 配置，使用直接代理

## 📋 待办事项

### 短期任务（1-2周）
- [ ] 完整的功能测试
- [ ] 错误处理优化
- [ ] 用户体验改进
- [ ] 移动端适配测试

### 中期任务（3-4周）
- [ ] 性能优化
- [ ] 安全审计
- [ ] 单元测试补充
- [ ] 集成测试

### 长期任务（1-2月）
- [ ] 生产环境部署
- [ ] 监控系统集成
- [ ] CI/CD流程
- [ ] 文档完善

## 🎯 下一步计划

1. **功能测试**：全面测试所有已实现功能
2. **用户体验优化**：改进加载状态、错误提示等
3. **安全加固**：修复安全漏洞，加强权限控制
4. **性能调优**：优化查询、添加缓存
5. **文档更新**：更新API文档和用户手册

## 🏆 团队贡献

感谢团队成员的努力：
- 完成了前后端架构搭建
- 实现了核心业务功能
- 建立了完整的开发工作流
- 创建了详细的文档体系

---

**报告更新时间：** 2025-09-14 10:27
**下次更新：** 功能测试完成后

---

# 后端API完整性检查

# 后台接口完整性评估报告

## 📊 评估概览

**评估日期**: 2025年9月14日
**后端服务**: NestJS + Prisma + SQLite
**完成度**: 40%

## ✅ 已实现接口

### 1. 认证模块 (AuthModule) - 完整 ✅
**路由前缀**: `/api/auth`

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/refresh` - 刷新token
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/profile` - 获取用户信息

### 2. 任务模块 (TasksModule) - 完整 ✅
**路由前缀**: `/api/tasks`

- `POST /api/tasks` - 创建任务
- `GET /api/tasks` - 获取任务列表
- `GET /api/tasks/stats` - 获取任务统计
- `GET /api/tasks/:id` - 获取单个任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 3. 基础接口 - 完整 ✅
- `GET /api` - API信息和端点列表
- `GET /api/health` - 健康检查

## ❌ 缺失接口

### 1. 日历事件模块 (CalendarModule) - 完全缺失 ❌
**预期路由**: `/api/calendar`

**数据库表**: `calendar_events` ✅ (已存在)
**控制器**: ❌ 未实现
**服务**: ❌ 未实现
**模块**: ❌ 未实现

**缺失接口**:
- `GET /api/calendar/events` - 获取日历事件列表
- `POST /api/calendar/events` - 创建日历事件
- `GET /api/calendar/events/:id` - 获取单个事件
- `PUT /api/calendar/events/:id` - 更新日历事件
- `DELETE /api/calendar/events/:id` - 删除日历事件
- `GET /api/calendar/events/month/:year/:month` - 按月获取事件

### 2. 用户管理模块 (UsersModule) - 完全缺失 ❌
**预期路由**: `/api/users`

**数据库表**: `users` ✅ (已存在)
**控制器**: ❌ 未实现
**服务**: ❌ 未实现
**模块**: ❌ 未实现

**缺失接口**:
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户
- `PUT /api/users/:id/status` - 更新用户状态
- `GET /api/users/search` - 搜索用户

### 3. 四象限分析模块 (QuadrantModule) - 完全缺失 ❌
**预期路由**: `/api/quadrant`

**功能**: 基于任务优先级和紧急程度分析
**控制器**: ❌ 未实现
**服务**: ❌ 未实现
**模块**: ❌ 未实现

**缺失接口**:
- `GET /api/quadrant/analysis` - 获取四象限分析
- `GET /api/quadrant/tasks` - 按象限获取任务
- `POST /api/quadrant/classify/:taskId` - 重新分类任务

### 4. 时间记录模块 (TimeEntriesModule) - 完全缺失 ❌
**预期路由**: `/api/time-entries`

**数据库表**: `time_entries` ✅ (已存在)
**控制器**: ❌ 未实现
**服务**: ❌ 未实现
**模块**: ❌ 未实现

**缺失接口**:
- `GET /api/time-entries` - 获取时间记录
- `POST /api/time-entries` - 创建时间记录
- `PUT /api/time-entries/:id` - 更新时间记录
- `DELETE /api/time-entries/:id` - 删除时间记录
- `GET /api/time-entries/stats` - 时间统计
- `GET /api/time-entries/report` - 生成时间报告

### 5. 任务评论子模块 - 部分缺失 ⚠️
**数据库表**: `task_comments` ✅ (已存在)

**缺失接口**:
- `GET /api/tasks/:taskId/comments` - 获取任务评论
- `POST /api/tasks/:taskId/comments` - 添加任务评论
- `DELETE /api/tasks/:taskId/comments/:commentId` - 删除评论

## 📈 数据模型完整性

### ✅ 已实现的数据表
- `users` - 用户表 (有对应的认证接口)
- `tasks` - 任务表 (有完整的CRUD接口)
- `refresh_tokens` - 刷新令牌表 (有对应认证接口)

### ⚠️ 有表无接口
- `calendar_events` - 日历事件表 (无对应接口)
- `time_entries` - 时间记录表 (无对应接口)
- `task_comments` - 任务评论表 (无对应接口)

## 🔧 实现优先级建议

### 高优先级 (核心功能)
1. **日历事件模块** - 前端日历页面需要
2. **任务评论子模块** - 任务详情页面需要
3. **时间记录模块** - 时间统计功能需要

### 中优先级 (管理功能)
4. **用户管理模块** - 管理员功能需要
5. **四象限分析模块** - 数据分析功能需要

### 低优先级 (扩展功能)
6. 文件上传接口
7. 通知系统接口
8. 系统设置接口

## 📋 开发清单

### Phase 1: 核心功能补全 (预计2-3天)
- [ ] 创建 CalendarModule
- [ ] 实现日历事件CRUD接口
- [ ] 添加任务评论子接口
- [ ] 实现时间记录CRUD接口

### Phase 2: 管理功能 (预计1-2天)
- [ ] 创建 UsersModule
- [ ] 实现用户管理接口
- [ ] 创建 QuadrantModule
- [ ] 实现四象限分析接口

### Phase 3: API优化 (预计1天)
- [ ] 添加接口文档
- [ ] 实现数据验证
- [ ] 添加错误处理
- [ ] 性能优化

## 🚨 影响评估

**前端功能受影响**:
- 日历页面无法正常工作
- 用户管理页面无法使用
- 时间统计功能缺失
- 四象限分析页面无数据
- 任务评论功能无法使用

**系统完整性**: 60% (主要功能可用，辅助功能缺失)

---

**报告生成时间**: 2025-09-14 10:49
**下次评估**: 接口补全完成后

---

# Web自动化测试指南

# Web自动化测试指南

## 1. 概述

本文档提供任务管理系统的完整测试策略和自动化测试实施指南，包括单元测试、集成测试、端到端测试以及性能测试。

## 2. 测试策略

### 2.1 测试金字塔
```
    ┌─────────────┐
    │   E2E Tests │ <- 少量，高价值
    │             │
    ├─────────────┤
    │Integration  │ <- 适中数量
    │   Tests     │
    ├─────────────┤
    │   Unit      │ <- 大量，快速
    │   Tests     │
    └─────────────┘
```

### 2.2 测试类型和工具

| 测试类型 | 工具 | 覆盖范围 | 执行频率 |
|---------|------|----------|----------|
| 单元测试 | Jest, Vitest | 函数、组件 | 每次提交 |
| 集成测试 | Jest, Supertest | API、模块间 | 每次提交 |
| 端到端测试 | Playwright, Cypress | 用户流程 | 每日构建 |
| 性能测试 | Lighthouse, K6 | 页面性能 | 每周 |
| 安全测试 | OWASP ZAP | 安全漏洞 | 每月 |

## 3. 后端测试

### 3.1 单元测试配置

#### 3.1.1 Jest 配置
创建 `backend/jest.config.js`:
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/main.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapping: {
    '^src/(.*)$': '<rootDir>/$1',
  },
};
```

#### 3.1.2 测试设置文件
创建 `backend/src/test/setup.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// 全局测试配置
export const createTestingModule = async (moduleClass: any, providers: any[] = []) => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: ['src/**/*.entity.ts'],
        synchronize: true,
        logging: false,
      }),
    ],
    providers: [
      ...providers,
    ],
  }).compile();

  return module;
};

// 测试数据工厂
export const TestDataFactory = {
  createUser: (overrides = {}) => ({
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123456',
    role: 'user',
    status: 'active',
    displayName: '测试用户',
    ...overrides,
  }),

  createTask: (overrides = {}) => ({
    title: '测试任务',
    description: '这是一个测试任务',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
    ...overrides,
  }),

  createTimeEntry: (overrides = {}) => ({
    description: '测试时间记录',
    hours: 2.5,
    date: new Date(),
    ...overrides,
  }),
};
```

### 3.2 服务单元测试

#### 3.2.1 用户服务测试
创建 `backend/src/modules/users/users.service.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestDataFactory } from '../../test/setup';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = TestDataFactory.createUser();
      const hashedPassword = 'hashedPassword';
      const savedUser = { id: 1, ...createUserDto, password: hashedPassword };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(savedUser);
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 12);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(repository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = TestDataFactory.createUser();
      const existingUser = { id: 1, ...createUserDto };

      mockRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const user = { id: userId, ...TestDataFactory.createUser() };

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { displayName: '更新的名称' };
      const existingUser = { id: userId, ...TestDataFactory.createUser() };
      const updatedUser = { ...existingUser, ...updateUserDto };

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });
});
```

#### 3.2.2 任务服务测试
创建 `backend/src/modules/tasks/tasks.service.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, TaskPriority } from './enums/task.enum';
import { TestDataFactory } from '../../test/setup';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = TestDataFactory.createTask();
      const creatorId = 1;
      const creator = { id: creatorId, role: UserRole.USER };
      const savedTask = {
        id: 1,
        ...createTaskDto,
        creatorId,
        creator,
        status: TaskStatus.PENDING,
      };

      mockUserRepository.findOne.mockResolvedValue(creator);
      mockTaskRepository.create.mockReturnValue(savedTask);
      mockTaskRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(createTaskDto, creatorId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: creatorId },
      });
      expect(taskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        creatorId,
        status: TaskStatus.PENDING,
      });
      expect(result).toEqual(savedTask);
    });

    it('should throw NotFoundException if assignee not found', async () => {
      const createTaskDto: CreateTaskDto = {
        ...TestDataFactory.createTask(),
        assigneeId: 999,
      };
      const creatorId = 1;

      mockUserRepository.findOne
        .mockResolvedValueOnce({ id: creatorId }) // creator
        .mockResolvedValueOnce(null); // assignee

      await expect(service.create(createTaskDto, creatorId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should return task for admin user', async () => {
      const taskId = 1;
      const userId = 1;
      const userRole = UserRole.ADMIN;
      const task = {
        id: taskId,
        ...TestDataFactory.createTask(),
        creatorId: 2,
        assigneeId: 3,
      };

      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await service.findById(taskId, userId, userRole);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['creator', 'assignee', 'comments', 'timeEntries'],
      });
      expect(result).toEqual(task);
    });

    it('should throw ForbiddenException for unauthorized user', async () => {
      const taskId = 1;
      const userId = 1;
      const userRole = UserRole.USER;
      const task = {
        id: taskId,
        ...TestDataFactory.createTask(),
        creatorId: 2,
        assigneeId: 3,
      };

      mockTaskRepository.findOne.mockResolvedValue(task);

      await expect(service.findById(taskId, userId, userRole)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const taskId = 1;
      const newStatus = TaskStatus.COMPLETED;
      const userId = 1;
      const task = {
        id: taskId,
        ...TestDataFactory.createTask(),
        creatorId: userId,
        status: TaskStatus.IN_PROGRESS,
      };
      const updatedTask = { ...task, status: newStatus, completedAt: new Date() };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      const result = await service.updateStatus(taskId, newStatus, userId);

      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: newStatus,
          completedAt: expect.any(Date),
        }),
      );
      expect(result).toEqual(updatedTask);
    });
  });
});
```

### 3.3 控制器测试

#### 3.3.1 认证控制器测试
创建 `backend/src/modules/auth/auth.controller.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TestDataFactory } from '../../test/setup';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validateUser: jest.fn(),
    generateTokens: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test123456',
      };
      const user = { id: 1, ...TestDataFactory.createUser() };
      const tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 900,
      };
      const expectedResult = { user, ...tokens };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        success: true,
        data: expectedResult,
      });
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = TestDataFactory.createUser();
      const user = { id: 1, ...registerDto };

      mockAuthService.register.mockResolvedValue(user);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        success: true,
        data: user,
      });
    });

    it('should throw BadRequestException on duplicate email', async () => {
      const registerDto: RegisterDto = TestDataFactory.createUser();

      mockAuthService.register.mockRejectedValue(new BadRequestException());

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { id: 1, ...TestDataFactory.createUser() };
      const req = { user };

      const result = await controller.getProfile(req);

      expect(result).toEqual({
        success: true,
        data: user,
      });
    });
  });
});
```

### 3.4 端到端测试

#### 3.4.1 E2E测试配置
创建 `backend/test/app.e2e-spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { TestDataFactory } from '../src/test/setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    const testUser = TestDataFactory.createUser();

    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toBe(testUser.email);
          expect(res.body.data).not.toHaveProperty('password');
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data).toHaveProperty('user');
          accessToken = res.body.data.accessToken;
        });
    });

    it('/auth/profile (GET)', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.email).toBe(testUser.email);
        });
    });
  });

  describe('Tasks', () => {
    const testTask = TestDataFactory.createTask();

    it('/tasks (POST)', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testTask)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe(testTask.title);
          expect(res.body.data.status).toBe('pending');
        });
    });

    it('/tasks (GET)', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body).toHaveProperty('pagination');
        });
    });
  });
});
```

### 3.5 运行测试命令

在 `backend/package.json` 中添加测试脚本:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

## 4. 前端测试

### 4.1 测试环境配置

#### 4.1.1 Vitest 配置
创建 `frontend/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/vite.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 4.1.2 测试设置文件
创建 `frontend/src/test/setup.ts`:
```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 扩展 expect
expect.extend(matchers);

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

#### 4.1.3 测试工具函数
创建 `frontend/src/test/utils.tsx`:
```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 测试用的 QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// 测试包装器
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={zhCN}>
          {children}
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// 自定义 render 函数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// 测试数据工厂
export const TestDataFactory = {
  createUser: (overrides = {}) => ({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    status: 'active',
    displayName: '测试用户',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),

  createTask: (overrides = {}) => ({
    id: 1,
    title: '测试任务',
    description: '这是一个测试任务',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-12-31T23:59:59.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    creator: {
      id: 1,
      username: 'creator',
      displayName: '创建者',
    },
    ...overrides,
  }),
};

// 重新导出所有内容
export * from '@testing-library/react';
export { customRender as render };
```

### 4.2 组件单元测试

#### 4.2.1 任务卡片组件测试
创建 `frontend/src/components/TaskCard/TaskCard.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';
import { render, TestDataFactory } from '@/test/utils';

describe('TaskCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnStatusChange = vi.fn();

  const defaultProps = {
    task: TestDataFactory.createTask(),
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onStatusChange: mockOnStatusChange,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText('测试任务')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试任务')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('displays due date when provided', () => {
    const taskWithDueDate = TestDataFactory.createTask({
      dueDate: '2024-12-31T23:59:59.000Z',
    });

    render(<TaskCard {...defaultProps} task={taskWithDueDate} />);

    expect(screen.getByText('2024-12-31')).toBeInTheDocument();
  });

  it('displays assignee information when provided', () => {
    const taskWithAssignee = TestDataFactory.createTask({
      assignee: {
        id: 2,
        username: 'assignee',
        displayName: '分配者',
      },
    });

    render(<TaskCard {...defaultProps} task={taskWithAssignee} />);

    expect(screen.getByText('分配者')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard {...defaultProps} />);

    const editButton = screen.getByLabelText('编辑');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(defaultProps.task);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    render(<TaskCard {...defaultProps} />);

    const deleteButton = screen.getByLabelText('删除');
    fireEvent.click(deleteButton);

    // 确认删除
    const confirmButton = screen.getByText('确定');
    fireEvent.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.task.id);
  });

  it('calls onStatusChange when status is changed', () => {
    render(<TaskCard {...defaultProps} />);

    const statusSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(statusSelect);

    const completedOption = screen.getByText('已完成');
    fireEvent.click(completedOption);

    expect(mockOnStatusChange).toHaveBeenCalledWith(
      defaultProps.task.id,
      'completed',
    );
  });

  it('shows overdue styling for past due date', () => {
    const overdueDTask = TestDataFactory.createTask({
      dueDate: '2020-01-01T23:59:59.000Z', // 过期日期
      status: 'pending',
    });

    render(<TaskCard {...defaultProps} task={overdueDTask} />);

    const card = screen.getByTestId('task-card');
    expect(card).toHaveClass('overdue');
  });

  it('displays task tags when provided', () => {
    const taskWithTags = TestDataFactory.createTask({
      tags: ['frontend', 'urgent'],
    });

    render(<TaskCard {...defaultProps} task={taskWithTags} />);

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });
});
```

#### 4.2.2 任务表单组件测试
创建 `frontend/src/components/TaskForm/TaskForm.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';
import { render, TestDataFactory } from '@/test/utils';

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByLabelText('任务标题')).toBeInTheDocument();
    expect(screen.getByLabelText('任务描述')).toBeInTheDocument();
    expect(screen.getByLabelText('优先级')).toBeInTheDocument();
    expect(screen.getByLabelText('截止日期')).toBeInTheDocument();
    expect(screen.getByText('提交')).toBeInTheDocument();
    expect(screen.getByText('取消')).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    // 填写表单
    await user.type(screen.getByLabelText('任务标题'), '新任务');
    await user.type(screen.getByLabelText('任务描述'), '任务描述内容');

    // 选择优先级
    await user.click(screen.getByLabelText('优先级'));
    await user.click(screen.getByText('高'));

    // 设置截止日期
    const dateInput = screen.getByLabelText('截止日期');
    await user.type(dateInput, '2024-12-31');

    // 提交表单
    await user.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: '新任务',
        description: '任务描述内容',
        priority: 'high',
        dueDate: expect.any(String),
      });
    });
  });

  it('displays validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    // 提交空表单
    await user.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(screen.getByText('请输入任务标题')).toBeInTheDocument();
      expect(screen.getByText('请选择优先级')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('populates form when editing existing task', () => {
    const existingTask = TestDataFactory.createTask({
      title: '现有任务',
      description: '现有描述',
      priority: 'high',
    });

    render(<TaskForm {...defaultProps} initialValues={existingTask} />);

    expect(screen.getByDisplayValue('现有任务')).toBeInTheDocument();
    expect(screen.getByDisplayValue('现有描述')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    await user.click(screen.getByText('取消'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when loading', () => {
    render(<TaskForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByText('提交');
    expect(submitButton).toBeDisabled();
  });

  it('validates title length', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    // 输入过长的标题
    const longTitle = 'a'.repeat(201);
    await user.type(screen.getByLabelText('任务标题'), longTitle);
    await user.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(screen.getByText('标题长度不能超过200字符')).toBeInTheDocument();
    });
  });
});
```

### 4.3 页面集成测试

#### 4.3.1 任务列表页面测试
创建 `frontend/src/pages/Tasks/TasksPage.test.tsx`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TasksPage } from './TasksPage';
import { render, TestDataFactory } from '@/test/utils';
import * as taskService from '@/services/taskService';

// Mock API calls
vi.mock('@/services/taskService');

describe('TasksPage', () => {
  const mockTasks = [
    TestDataFactory.createTask({ id: 1, title: '任务1' }),
    TestDataFactory.createTask({ id: 2, title: '任务2', status: 'completed' }),
  ];

  beforeEach(() => {
    vi.mocked(taskService.getTasks).mockResolvedValue({
      data: mockTasks,
      pagination: {
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders task list correctly', async () => {
    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('任务1')).toBeInTheDocument();
      expect(screen.getByText('任务2')).toBeInTheDocument();
    });
  });

  it('opens create task modal when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);

    await user.click(screen.getByText('创建任务'));

    expect(screen.getByText('创建新任务')).toBeInTheDocument();
    expect(screen.getByLabelText('任务标题')).toBeInTheDocument();
  });

  it('creates new task successfully', async () => {
    const user = userEvent.setup();
    const newTask = TestDataFactory.createTask({ id: 3, title: '新任务' });

    vi.mocked(taskService.createTask).mockResolvedValue({ data: newTask });
    vi.mocked(taskService.getTasks).mockResolvedValueOnce({
      data: [...mockTasks, newTask],
      pagination: {
        page: 1,
        limit: 20,
        total: 3,
        totalPages: 1,
      },
    });

    render(<TasksPage />);

    // 打开创建表单
    await user.click(screen.getByText('创建任务'));

    // 填写表单
    await user.type(screen.getByLabelText('任务标题'), '新任务');
    await user.click(screen.getByLabelText('优先级'));
    await user.click(screen.getByText('中'));

    // 提交表单
    await user.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith({
        title: '新任务',
        priority: 'medium',
      });
    });

    // 验证任务被添加到列表
    await waitFor(() => {
      expect(screen.getByText('新任务')).toBeInTheDocument();
    });
  });

  it('filters tasks by status', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);

    // 点击状态筛选
    await user.click(screen.getByText('状态筛选'));
    await user.click(screen.getByText('已完成'));

    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalledWith({
        status: 'completed',
        page: 1,
        limit: 20,
      });
    });
  });

  it('searches tasks by keyword', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);

    const searchInput = screen.getByPlaceholderText('搜索任务...');
    await user.type(searchInput, '任务1');

    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalledWith({
        search: '任务1',
        page: 1,
        limit: 20,
      });
    });
  });

  it('deletes task when confirmed', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.deleteTask).mockResolvedValue({ success: true });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('任务1')).toBeInTheDocument();
    });

    // 点击删除按钮
    const deleteButtons = screen.getAllByLabelText('删除');
    await user.click(deleteButtons[0]);

    // 确认删除
    await user.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });

  it('shows loading state while fetching tasks', () => {
    vi.mocked(taskService.getTasks).mockImplementation(
      () => new Promise(() => {}), // 永不解决的 Promise
    );

    render(<TasksPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    vi.mocked(taskService.getTasks).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('加载任务失败')).toBeInTheDocument();
    });
  });
});
```

### 4.4 Hook 测试

#### 4.4.1 useAuth Hook 测试
创建 `frontend/src/hooks/useAuth.test.tsx`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as authService from '@/services/authService';
import { TestDataFactory } from '@/test/utils';

// Mock API calls
vi.mock('@/services/authService');

describe('useAuth', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    // 清除 localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with no user when no token in localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('loads user profile when token exists in localStorage', async () => {
    const user = TestDataFactory.createUser();
    localStorage.setItem('accessToken', 'valid-token');
    vi.mocked(authService.getProfile).mockResolvedValue({ data: user });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(user);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('logs in user successfully', async () => {
    const user = TestDataFactory.createUser();
    const loginResponse = {
      data: {
        user,
        accessToken: 'new-token',
        refreshToken: 'refresh-token',
      },
    };

    vi.mocked(authService.login).mockResolvedValue(loginResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password',
      });
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('accessToken')).toBe('new-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
  });

  it('handles login error', async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new Error('Invalid credentials'),
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong-password',
        });
      } catch (error) {
        // 期望抛出错误
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('logs out user successfully', async () => {
    const user = TestDataFactory.createUser();
    localStorage.setItem('accessToken', 'token');
    localStorage.setItem('refreshToken', 'refresh');

    vi.mocked(authService.getProfile).mockResolvedValue({ data: user });
    vi.mocked(authService.logout).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 等待初始加载完成
    await waitFor(() => {
      expect(result.current.user).toEqual(user);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('registers new user successfully', async () => {
    const newUser = TestDataFactory.createUser();
    vi.mocked(authService.register).mockResolvedValue({ data: newUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
      });
    });

    expect(authService.register).toHaveBeenCalledWith({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
    });
  });
});
```

## 5. 端到端测试 (E2E)

### 5.1 Playwright 配置

#### 5.1.1 安装和配置
```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

创建 `frontend/playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd ../backend && npm run start:dev',
      url: 'http://localhost:3000/health',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

### 5.2 E2E 测试用例

#### 5.2.1 用户认证流程测试
创建 `frontend/e2e/auth.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('用户认证', () => {
  test('用户可以注册、登录和登出', async ({ page }) => {
    // 注册新用户
    await page.goto('/register');
    await page.fill('[data-testid="username-input"]', 'testuser');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'Test123456');
    await page.fill('[data-testid="displayName-input"]', '测试用户');
    await page.click('[data-testid="register-button"]');

    // 验证注册成功并跳转到登录页
    await expect(page).toHaveURL('/login');
    await expect(page.locator('.ant-message')).toContainText('注册成功');

    // 登录
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'Test123456');
    await page.click('[data-testid="login-button"]');

    // 验证登录成功并跳转到仪表盘
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toContainText('测试用户');

    // 登出
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    // 验证登出成功并跳转到登录页
    await expect(page).toHaveURL('/login');
  });

  test('登录失败时显示错误信息', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('.ant-message-error')).toContainText('用户名或密码错误');
  });

  test('未登录用户访问受保护页面时跳转到登录页', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page).toHaveURL('/login');
  });
});
```

#### 5.2.2 任务管理流程测试
创建 `frontend/e2e/tasks.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('任务管理', () => {
  test.beforeEach(async ({ page }) => {
    // 登录用户
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'admin123456');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('创建、编辑和删除任务', async ({ page }) => {
    await page.goto('/tasks');

    // 创建新任务
    await page.click('[data-testid="create-task-button"]');
    await expect(page.locator('[data-testid="task-form-modal"]')).toBeVisible();

    await page.fill('[data-testid="task-title-input"]', 'E2E测试任务');
    await page.fill('[data-testid="task-description-input"]', '这是一个端到端测试任务');
    await page.selectOption('[data-testid="task-priority-select"]', 'high');
    await page.fill('[data-testid="task-dueDate-input"]', '2024-12-31');
    await page.click('[data-testid="task-form-submit"]');

    // 验证任务创建成功
    await expect(page.locator('.ant-message-success')).toContainText('任务创建成功');
    await expect(page.locator('[data-testid="task-card"]')).toContainText('E2E测试任务');

    // 编辑任务
    await page.hover('[data-testid="task-card"]:has-text("E2E测试任务")');
    await page.click('[data-testid="edit-task-button"]');

    await page.fill('[data-testid="task-title-input"]', 'E2E测试任务 - 已编辑');
    await page.click('[data-testid="task-form-submit"]');

    // 验证任务编辑成功
    await expect(page.locator('.ant-message-success')).toContainText('任务更新成功');
    await expect(page.locator('[data-testid="task-card"]')).toContainText('E2E测试任务 - 已编辑');

    // 更改任务状态
    await page.hover('[data-testid="task-card"]:has-text("E2E测试任务 - 已编辑")');
    await page.click('[data-testid="task-status-select"]');
    await page.click('[data-testid="status-option-completed"]');

    // 验证状态更新成功
    await expect(page.locator('.ant-message-success')).toContainText('任务状态更新成功');
    await expect(page.locator('[data-testid="task-card"] .status-tag')).toContainText('已完成');

    // 删除任务
    await page.hover('[data-testid="task-card"]:has-text("E2E测试任务 - 已编辑")');
    await page.click('[data-testid="delete-task-button"]');
    await page.click('[data-testid="confirm-delete-button"]');

    // 验证任务删除成功
    await expect(page.locator('.ant-message-success')).toContainText('任务删除成功');
    await expect(page.locator('[data-testid="task-card"]:has-text("E2E测试任务 - 已编辑")')).not.toBeVisible();
  });

  test('任务筛选和搜索功能', async ({ page }) => {
    await page.goto('/tasks');

    // 按状态筛选
    await page.click('[data-testid="status-filter"]');
    await page.click('[data-testid="filter-option-completed"]');

    // 验证只显示已完成的任务
    await expect(page.locator('[data-testid="task-card"] .status-tag')).toContainText('已完成');

    // 按优先级筛选
    await page.click('[data-testid="priority-filter"]');
    await page.click('[data-testid="filter-option-high"]');

    // 搜索任务
    await page.fill('[data-testid="search-input"]', 'API');
    await page.press('[data-testid="search-input"]', 'Enter');

    // 验证搜索结果
    await expect(page.locator('[data-testid="task-card"]')).toContainText('API');

    // 清除筛选
    await page.click('[data-testid="clear-filters-button"]');
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('');
  });

  test('任务分页功能', async ({ page }) => {
    await page.goto('/tasks');

    // 如果有分页，测试分页功能
    const paginationExists = await page.locator('.ant-pagination').isVisible();

    if (paginationExists) {
      // 点击下一页
      await page.click('.ant-pagination-next');
      await expect(page.locator('.ant-pagination-item-active')).toContainText('2');

      // 点击上一页
      await page.click('.ant-pagination-prev');
      await expect(page.locator('.ant-pagination-item-active')).toContainText('1');

      // 改变每页显示数量
      await page.click('.ant-select-selector');
      await page.click('[data-testid="pageSize-option-50"]');

      // 验证 URL 参数更新
      await expect(page).toHaveURL(/limit=50/);
    }
  });
});
```

#### 5.2.3 响应式设计测试
创建 `frontend/e2e/responsive.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('响应式设计', () => {
  test.beforeEach(async ({ page }) => {
    // 登录用户
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'admin123456');
    await page.click('[data-testid="login-button"]');
  });

  test('移动端导航菜单', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // 验证移动端菜单按钮存在
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

    // 点击菜单按钮
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // 点击菜单项
    await page.click('[data-testid="mobile-menu-tasks"]');
    await expect(page).toHaveURL('/tasks');
  });

  test('平板端布局适配', async ({ page }) => {
    // 设置平板端视口
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/tasks');

    // 验证任务卡片在平板端的布局
    const taskCards = page.locator('[data-testid="task-card"]');
    const count = await taskCards.count();

    if (count > 0) {
      const firstCard = taskCards.first();
      const cardBox = await firstCard.boundingBox();
      expect(cardBox?.width).toBeLessThan(768);
      expect(cardBox?.width).toBeGreaterThan(300);
    }
  });

  test('桌面端布局', async ({ page }) => {
    // 设置桌面端视口
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/tasks');

    // 验证侧边栏在桌面端显示
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

    // 验证任务列表网格布局
    const taskGrid = page.locator('[data-testid="task-grid"]');
    const gridBox = await taskGrid.boundingBox();
    expect(gridBox?.width).toBeGreaterThan(1000);
  });
});
```

### 5.3 性能测试

#### 5.3.1 Lighthouse 性能测试
创建 `frontend/e2e/performance.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('性能测试', () => {
  test('主页性能指标', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Lighthouse 只支持 Chromium');

    await page.goto('/');

    await playAudit({
      page: page,
      thresholds: {
        performance: 80,
        accessibility: 90,
        'best-practices': 80,
        seo: 80,
      },
      port: 9222,
    });
  });

  test('任务列表页面加载性能', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'admin123456');
    await page.click('[data-testid="login-button"]');

    // 测量页面加载时间
    const startTime = Date.now();
    await page.goto('/tasks');
    await page.waitForSelector('[data-testid="task-list"]');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 页面应在3秒内加载完成
  });

  test('大量数据渲染性能', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'admin123456');
    await page.click('[data-testid="login-button"]');

    await page.goto('/tasks');

    // 模拟加载大量任务
    await page.evaluate(() => {
      // 这里可以通过 API mock 或其他方式注入大量数据
    });

    // 测量滚动性能
    const startTime = Date.now();
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    const scrollTime = Date.now() - startTime;

    expect(scrollTime).toBeLessThan(1000); // 滚动应该流畅
  });
});
```

### 5.4 可访问性测试

#### 5.4.1 使用 axe-playwright
```bash
npm install -D @axe-core/playwright
```

创建 `frontend/e2e/accessibility.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('可访问性测试', () => {
  test('登录页面可访问性', async ({ page }) => {
    await page.goto('/login');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('任务列表页面可访问性', async ({ page }) => {
    // 登录
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'admin123456');
    await page.click('[data-testid="login-button"]');

    await page.goto('/tasks');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('键盘导航', async ({ page }) => {
    await page.goto('/login');

    // 测试 Tab 键导航
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="password-input"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="login-button"]')).toBeFocused();

    // 测试 Enter 键提交
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'admin123456');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/dashboard');
  });

  test('屏幕阅读器友好性', async ({ page }) => {
    await page.goto('/tasks');

    // 检查重要元素是否有正确的 ARIA 标签
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[aria-label="主导航"]')).toBeVisible();
    await expect(page.locator('[aria-label="任务列表"]')).toBeVisible();

    // 检查表单元素是否有正确的标签
    const inputs = page.locator('input');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.getAttribute('aria-label') ||
                      await input.getAttribute('aria-labelledby') ||
                      await page.locator(`label[for="${await input.getAttribute('id')}"]`).isVisible();
      expect(hasLabel).toBeTruthy();
    }
  });
});
```

## 6. API 测试

### 6.1 Postman/Newman 集成
创建 `tests/api/task-manager-api.postman_collection.json`:
```json
{
  "info": {
    "name": "Task Manager API",
    "version": "1.0.0",
    "description": "任务管理系统 API 测试集合"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123456\",\n  \"displayName\": \"测试用户\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          },
          "test": [
            "pm.test('Status code is 201', function () {",
            "    pm.response.to.have.status(201);",
            "});",
            "",
            "pm.test('Response has success flag', function () {",
            "    const jsonData = pm.response.json();",
            "    pm.expect(jsonData.success).to.be.true;",
            "});",
            "",
            "pm.test('User data is returned', function () {",
            "    const jsonData = pm.response.json();",
            "    pm.expect(jsonData.data).to.have.property('id');",
            "    pm.expect(jsonData.data).to.have.property('email');",
            "    pm.expect(jsonData.data).to.not.have.property('password');",
            "});"
          ]
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123456\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          },
          "test": [
            "pm.test('Status code is 200', function () {",
            "    pm.response.to.have.status(200);",
            "});",
            "",
            "pm.test('Access token is provided', function () {",
            "    const jsonData = pm.response.json();",
            "    pm.expect(jsonData.data).to.have.property('accessToken');",
            "    pm.collectionVariables.set('access_token', jsonData.data.accessToken);",
            "});",
            "",
            "pm.test('User info is included', function () {",
            "    const jsonData = pm.response.json();",
            "    pm.expect(jsonData.data).to.have.property('user');",
            "    pm.expect(jsonData.data.user).to.have.property('email');",
            "});"
          ]
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"API测试任务\",\n  \"description\": \"通过API创建的测试任务\",\n  \"priority\": \"medium\",\n  \"dueDate\": \"2024-12-31T23:59:59.000Z\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/tasks",
              "host": ["{{base_url}}"],
              "path": ["tasks"]
            }
          },
          "test": [
            "pm.test('Status code is 201', function () {",
            "    pm.response.to.have.status(201);",
            "});",
            "",
            "pm.test('Task is created with correct data', function () {",
            "    const jsonData = pm.response.json();",
            "    pm.expect(jsonData.data.title).to.equal('API测试任务');",
            "    pm.expect(jsonData.data.status).to.equal('pending');",
            "    pm.collectionVariables.set('task_id', jsonData.data.id);",
            "});"
          ]
        },
        {
          "name": "Get Tasks",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/tasks?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["tasks"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          },
          "test": [
            "pm.test('Status code is 200', function () {",
            "    pm.response.to.have.status(200);",
            "});",
            "",
            "pm.test('Response includes pagination', function () {",
            "    const jsonData = pm.response.json();",
            "    pm.expect(jsonData).to.have.property('pagination');",
            "    pm.expect(jsonData.pagination).to.have.property('page');",
            "    pm.expect(jsonData.pagination).to.have.property('total');",
            "});"
          ]
        }
      ]
    }
  ]
}
```

### 6.2 运行 API 测试
在 `package.json` 中添加脚本：
```json
{
  "scripts": {
    "test:api": "newman run tests/api/task-manager-api.postman_collection.json -e tests/api/environment.json --reporters cli,json --reporter-json-export test-results/api-results.json"
  }
}
```

## 7. 测试运行和报告

### 7.1 CI/CD 集成

#### 7.1.1 GitHub Actions 配置
创建 `.github/workflows/test.yml`:
```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run unit tests
        working-directory: backend
        run: npm run test:cov

      - name: Run e2e tests
        working-directory: backend
        run: npm run test:e2e

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          directory: backend/coverage
          flags: backend

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Run unit tests
        working-directory: frontend
        run: npm run test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          directory: frontend/coverage
          flags: frontend

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install backend dependencies
        working-directory: backend
        run: npm ci

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Install Playwright
        working-directory: frontend
        run: npx playwright install --with-deps

      - name: Start backend server
        working-directory: backend
        run: npm run start:dev &

      - name: Start frontend server
        working-directory: frontend
        run: npm run dev &

      - name: Wait for servers
        run: |
          npx wait-on http://localhost:3000/health
          npx wait-on http://localhost:5173

      - name: Run Playwright tests
        working-directory: frontend
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

### 7.2 测试报告和覆盖率

#### 7.2.1 Jest 配置覆盖率报告
在 `backend/jest.config.js` 中：
```javascript
module.exports = {
  // ... 其他配置
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/main.ts',
  ],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### 7.2.2 Vitest 配置覆盖率报告
在 `frontend/vitest.config.ts` 中：
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
      ],
    },
  },
});
```

### 7.3 测试命令脚本

#### 7.3.1 后端测试脚本
在 `backend/package.json` 中：
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:e2e:watch": "jest --config ./test/jest-e2e.json --watch",
    "test:unit": "jest --testPathIgnorePatterns=.*\\.e2e-spec\\.ts$",
    "test:integration": "jest --testPathPattern=.*\\.integration\\.spec\\.ts$"
  }
}
```

#### 7.3.2 前端测试脚本
在 `frontend/package.json` 中：
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:component": "vitest --run --reporter=verbose src/components",
    "test:pages": "vitest --run --reporter=verbose src/pages",
    "test:hooks": "vitest --run --reporter=verbose src/hooks"
  }
}
```

## 8. 最佳实践和建议

### 8.1 测试编写原则

1. **AAA 模式**: Arrange（准备）、Act（执行）、Assert（断言）
2. **单一职责**: 每个测试只验证一个功能点
3. **独立性**: 测试之间不应相互依赖
4. **可重复性**: 测试结果应该稳定可重复
5. **快速执行**: 单元测试应该快速执行

### 8.2 Mock 和 Stub 使用

1. **外部依赖**: Mock 外部 API 调用
2. **数据库操作**: 使用内存数据库或 Mock
3. **时间相关**: Mock Date 和定时器
4. **文件操作**: Mock 文件系统操作

### 8.3 测试数据管理

1. **工厂模式**: 使用工厂函数创建测试数据
2. **数据隔离**: 每个测试使用独立的数据
3. **清理策略**: 测试后及时清理数据
4. **种子数据**: 为 E2E 测试准备稳定的种子数据

### 8.4 性能测试建议

1. **关键路径**: 重点测试用户关键操作路径
2. **资源监控**: 监控内存、CPU 使用情况
3. **并发测试**: 测试系统在并发情况下的表现
4. **边界测试**: 测试系统处理极限数据的能力

## 9. 总结

本测试指南提供了任务管理系统的完整测试策略和实施方案，包括：

1. **测试策略**: 明确的测试金字塔和工具选择
2. **单元测试**: 后端服务、控制器和前端组件的详细测试
3. **集成测试**: API 和模块间交互测试
4. **端到端测试**: 完整用户流程的自动化测试
5. **性能测试**: 页面性能和负载测试
6. **可访问性测试**: 确保应用的可访问性
7. **CI/CD 集成**: 自动化测试流程和报告

遵循本指南可以确保系统的质量和稳定性，提高开发效率，降低生产环境的风险。建议根据项目需求调整测试策略，保持测试用例的及时更新和维护。