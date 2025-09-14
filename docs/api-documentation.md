# API 接口文档

## 1. 概述

### 1.1 基本信息
- **服务名称**: 任务管理系统 API
- **版本**: v1.0.0
- **基础URL**: `http://localhost:3000/api`
- **协议**: HTTP/HTTPS
- **数据格式**: JSON

### 1.2 认证方式
API 使用 JWT (JSON Web Token) 进行身份认证。

#### 认证流程
1. 客户端发送登录请求获取访问令牌
2. 在后续请求的 Header 中包含访问令牌：`Authorization: Bearer <access_token>`
3. 访问令牌过期后使用刷新令牌获取新的访问令牌

### 1.3 响应格式规范

#### 成功响应
```json
{
  "success": true,
  "data": {}, // 响应数据
  "message": "操作成功" // 可选的消息
}
```

#### 分页响应
```json
{
  "success": true,
  "data": [], // 数据数组
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {} // 可选的详细信息
  }
}
```

### 1.4 HTTP 状态码

| 状态码 | 描述 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 400 | Bad Request | 客户端请求错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 422 | Unprocessable Entity | 请求参数验证失败 |
| 500 | Internal Server Error | 服务器内部错误 |

## 2. 认证接口

### 2.1 用户登录

**接口描述**: 用户登录获取访问令牌

**请求信息**:
- **方法**: POST
- **路径**: `/auth/login`
- **认证**: 无需认证

**请求参数**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| email | string | 是 | 用户邮箱 |
| password | string | 是 | 用户密码 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "status": "active",
      "displayName": "管理员",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

### 2.2 用户注册

**接口描述**: 注册新用户账户

**请求信息**:
- **方法**: POST
- **路径**: `/auth/register`
- **认证**: 无需认证

**请求参数**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123",
  "displayName": "John Doe"
}
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| username | string | 是 | 用户名 (3-50字符) |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码 (至少6位，包含大小写字母和数字) |
| displayName | string | 否 | 显示名称 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "displayName": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.3 刷新令牌

**接口描述**: 使用刷新令牌获取新的访问令牌

**请求信息**:
- **方法**: POST
- **路径**: `/auth/refresh`
- **认证**: 无需认证

**请求参数**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

### 2.4 用户登出

**接口描述**: 用户登出，使刷新令牌失效

**请求信息**:
- **方法**: POST
- **路径**: `/auth/logout`
- **认证**: 需要认证

**响应示例**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

### 2.5 获取当前用户信息

**接口描述**: 获取当前登录用户的详细信息

**请求信息**:
- **方法**: GET
- **路径**: `/auth/profile`
- **认证**: 需要认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "displayName": "管理员",
    "avatar": null,
    "phone": null,
    "department": "技术部",
    "position": "系统管理员",
    "lastLoginAt": "2024-01-01T10:00:00.000Z",
    "lastLoginIp": "192.168.1.100",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

## 3. 用户管理接口

### 3.1 获取用户列表

**接口描述**: 获取用户列表 (仅管理员可访问)

**请求信息**:
- **方法**: GET
- **路径**: `/users`
- **认证**: 需要认证 (仅管理员)

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 |
| role | string | 否 | - | 用户角色筛选 |
| status | string | 否 | - | 用户状态筛选 |
| search | string | 否 | - | 搜索关键词 (用户名/邮箱) |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | DESC | 排序方向 (ASC/DESC) |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "status": "active",
      "displayName": "管理员",
      "department": "技术部",
      "position": "系统管理员",
      "lastLoginAt": "2024-01-01T10:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3.2 获取用户详情

**接口描述**: 根据用户ID获取用户详细信息

**请求信息**:
- **方法**: GET
- **路径**: `/users/{id}`
- **认证**: 需要认证

**路径参数**:
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | number | 是 | 用户ID |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "displayName": "管理员",
    "avatar": null,
    "phone": null,
    "department": "技术部",
    "position": "系统管理员",
    "lastLoginAt": "2024-01-01T10:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 3.3 创建用户

**接口描述**: 创建新用户 (仅管理员可访问)

**请求信息**:
- **方法**: POST
- **路径**: `/users`
- **认证**: 需要认证 (仅管理员)

**请求参数**:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "Password123",
  "role": "user",
  "displayName": "新用户",
  "department": "开发部",
  "position": "软件工程师"
}
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| username | string | 是 | 用户名 (3-50字符) |
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码 |
| role | string | 否 | 用户角色 (默认: user) |
| displayName | string | 否 | 显示名称 |
| department | string | 否 | 部门 |
| position | string | 否 | 职位 |
| phone | string | 否 | 电话号码 |

### 3.4 更新用户信息

**接口描述**: 更新用户信息

**请求信息**:
- **方法**: PUT
- **路径**: `/users/{id}` (管理员) 或 `/users/profile` (普通用户)
- **认证**: 需要认证

**请求参数**:
```json
{
  "displayName": "更新的显示名称",
  "department": "产品部",
  "position": "产品经理",
  "phone": "13800138000"
}
```

### 3.5 修改密码

**接口描述**: 修改用户密码

**请求信息**:
- **方法**: PUT
- **路径**: `/users/password`
- **认证**: 需要认证

**请求参数**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

### 3.6 删除用户

**接口描述**: 删除用户 (仅管理员可访问)

**请求信息**:
- **方法**: DELETE
- **路径**: `/users/{id}`
- **认证**: 需要认证 (仅管理员)

## 4. 任务管理接口

### 4.1 获取任务列表

**接口描述**: 获取任务列表

**请求信息**:
- **方法**: GET
- **路径**: `/tasks`
- **认证**: 需要认证

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 |
| status | string | 否 | - | 任务状态筛选 |
| priority | string | 否 | - | 优先级筛选 |
| assigneeId | number | 否 | - | 分配用户ID筛选 |
| creatorId | number | 否 | - | 创建用户ID筛选 |
| search | string | 否 | - | 搜索关键词 (标题/描述) |
| tags | string[] | 否 | - | 标签筛选 |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | DESC | 排序方向 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "实现用户认证功能",
      "description": "实现JWT认证和权限控制",
      "status": "in_progress",
      "priority": "high",
      "tags": ["backend", "security"],
      "dueDate": "2024-01-15T23:59:59.000Z",
      "completedAt": null,
      "estimatedHours": 8.0,
      "actualHours": 4.5,
      "assignee": {
        "id": 2,
        "username": "developer",
        "displayName": "开发者"
      },
      "creator": {
        "id": 1,
        "username": "admin",
        "displayName": "管理员"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-05T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 4.2 获取任务详情

**接口描述**: 根据任务ID获取任务详细信息

**请求信息**:
- **方法**: GET
- **路径**: `/tasks/{id}`
- **认证**: 需要认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户认证功能",
    "description": "实现JWT认证和权限控制\n包括:\n1. 用户登录/注册\n2. JWT令牌生成\n3. 权限验证中间件",
    "status": "in_progress",
    "priority": "high",
    "tags": ["backend", "security"],
    "dueDate": "2024-01-15T23:59:59.000Z",
    "completedAt": null,
    "estimatedHours": 8.0,
    "actualHours": 4.5,
    "assignee": {
      "id": 2,
      "username": "developer",
      "email": "developer@example.com",
      "displayName": "开发者"
    },
    "creator": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "displayName": "管理员"
    },
    "comments": [
      {
        "id": 1,
        "content": "开始开发认证模块",
        "user": {
          "id": 2,
          "username": "developer",
          "displayName": "开发者"
        },
        "createdAt": "2024-01-02T09:00:00.000Z"
      }
    ],
    "timeEntries": [
      {
        "id": 1,
        "description": "设计认证架构",
        "hours": 2.0,
        "date": "2024-01-02",
        "user": {
          "id": 2,
          "username": "developer",
          "displayName": "开发者"
        },
        "createdAt": "2024-01-02T11:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-05T10:00:00.000Z"
  }
}
```

### 4.3 创建任务

**接口描述**: 创建新任务

**请求信息**:
- **方法**: POST
- **路径**: `/tasks`
- **认证**: 需要认证

**请求参数**:
```json
{
  "title": "实现任务管理功能",
  "description": "开发任务的增删改查功能",
  "priority": "medium",
  "dueDate": "2024-01-20T23:59:59.000Z",
  "assigneeId": 2,
  "tags": ["frontend", "backend"],
  "estimatedHours": 16.0
}
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | 是 | 任务标题 (1-200字符) |
| description | string | 否 | 任务描述 (最多2000字符) |
| priority | string | 是 | 优先级 (low/medium/high/urgent) |
| dueDate | string | 否 | 截止日期 (ISO 8601格式) |
| assigneeId | number | 否 | 分配用户ID |
| tags | string[] | 否 | 任务标签 |
| estimatedHours | number | 否 | 预估工时 |

### 4.4 更新任务

**接口描述**: 更新任务信息

**请求信息**:
- **方法**: PUT
- **路径**: `/tasks/{id}`
- **认证**: 需要认证

**请求参数**:
```json
{
  "title": "更新的任务标题",
  "description": "更新的任务描述",
  "priority": "high",
  "dueDate": "2024-01-25T23:59:59.000Z",
  "assigneeId": 3,
  "tags": ["frontend", "backend", "urgent"],
  "estimatedHours": 20.0
}
```

### 4.5 更新任务状态

**接口描述**: 更新任务状态

**请求信息**:
- **方法**: PATCH
- **路径**: `/tasks/{id}/status`
- **认证**: 需要认证

**请求参数**:
```json
{
  "status": "completed"
}
```

| 状态值 | 描述 |
|--------|------|
| pending | 待开始 |
| in_progress | 进行中 |
| completed | 已完成 |
| cancelled | 已取消 |

### 4.6 分配任务

**接口描述**: 将任务分配给指定用户

**请求信息**:
- **方法**: PATCH
- **路径**: `/tasks/{id}/assign`
- **认证**: 需要认证

**请求参数**:
```json
{
  "assigneeId": 2
}
```

### 4.7 删除任务

**接口描述**: 删除任务

**请求信息**:
- **方法**: DELETE
- **路径**: `/tasks/{id}`
- **认证**: 需要认证

## 5. 任务评论接口

### 5.1 获取任务评论

**接口描述**: 获取指定任务的评论列表

**请求信息**:
- **方法**: GET
- **路径**: `/tasks/{taskId}/comments`
- **认证**: 需要认证

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "开始开发认证模块",
      "user": {
        "id": 2,
        "username": "developer",
        "displayName": "开发者",
        "avatar": null
      },
      "createdAt": "2024-01-02T09:00:00.000Z",
      "updatedAt": "2024-01-02T09:00:00.000Z"
    }
  ]
}
```

### 5.2 添加任务评论

**接口描述**: 为指定任务添加评论

**请求信息**:
- **方法**: POST
- **路径**: `/tasks/{taskId}/comments`
- **认证**: 需要认证

**请求参数**:
```json
{
  "content": "已完成用户认证模块的设计和开发"
}
```

### 5.3 更新评论

**接口描述**: 更新评论内容

**请求信息**:
- **方法**: PUT
- **路径**: `/tasks/{taskId}/comments/{commentId}`
- **认证**: 需要认证

**请求参数**:
```json
{
  "content": "更新的评论内容"
}
```

### 5.4 删除评论

**接口描述**: 删除评论

**请求信息**:
- **方法**: DELETE
- **路径**: `/tasks/{taskId}/comments/{commentId}`
- **认证**: 需要认证

## 6. 时间记录接口

### 6.1 获取时间记录

**接口描述**: 获取时间记录列表

**请求信息**:
- **方法**: GET
- **路径**: `/time-entries`
- **认证**: 需要认证

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 |
| taskId | number | 否 | - | 任务ID筛选 |
| userId | number | 否 | - | 用户ID筛选 |
| startDate | string | 否 | - | 开始日期 |
| endDate | string | 否 | - | 结束日期 |

### 6.2 创建时间记录

**接口描述**: 创建新的时间记录

**请求信息**:
- **方法**: POST
- **路径**: `/time-entries`
- **认证**: 需要认证

**请求参数**:
```json
{
  "taskId": 1,
  "description": "实现用户注册接口",
  "hours": 3.5,
  "date": "2024-01-03"
}
```

### 6.3 更新时间记录

**接口描述**: 更新时间记录

**请求信息**:
- **方法**: PUT
- **路径**: `/time-entries/{id}`
- **认证**: 需要认证

### 6.4 删除时间记录

**接口描述**: 删除时间记录

**请求信息**:
- **方法**: DELETE
- **路径**: `/time-entries/{id}`
- **认证**: 需要认证

### 6.5 获取时间统计

**接口描述**: 获取时间统计信息

**请求信息**:
- **方法**: GET
- **路径**: `/time-entries/stats`
- **认证**: 需要认证

**查询参数**:
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| taskId | number | 否 | 任务ID |
| userId | number | 否 | 用户ID |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalHours": 45.5,
    "taskStats": [
      {
        "taskId": 1,
        "taskTitle": "实现用户认证功能",
        "totalHours": 15.5
      }
    ],
    "userStats": [
      {
        "userId": 2,
        "userName": "developer",
        "totalHours": 30.0
      }
    ],
    "dailyStats": [
      {
        "date": "2024-01-01",
        "hours": 8.0
      }
    ]
  }
}
```

## 7. 数据模型

### 7.1 用户模型 (User)

```typescript
interface User {
  id: number;                    // 用户ID
  username: string;              // 用户名
  email: string;                 // 邮箱地址
  role: 'admin' | 'user';       // 用户角色
  status: 'active' | 'inactive' | 'suspended'; // 用户状态
  displayName?: string;          // 显示名称
  avatar?: string;               // 头像URL
  phone?: string;                // 电话号码
  department?: string;           // 部门
  position?: string;             // 职位
  lastLoginAt?: Date;            // 最后登录时间
  lastLoginIp?: string;          // 最后登录IP
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
}
```

### 7.2 任务模型 (Task)

```typescript
interface Task {
  id: number;                    // 任务ID
  title: string;                 // 任务标题
  description?: string;          // 任务描述
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'; // 任务状态
  priority: 'low' | 'medium' | 'high' | 'urgent'; // 优先级
  tags?: string[];               // 标签
  dueDate?: Date;                // 截止日期
  completedAt?: Date;            // 完成时间
  estimatedHours?: number;       // 预估工时
  actualHours?: number;          // 实际工时
  assigneeId?: number;           // 分配用户ID
  creatorId: number;             // 创建用户ID
  assignee?: User;               // 分配用户信息
  creator: User;                 // 创建用户信息
  comments?: TaskComment[];      // 评论列表
  timeEntries?: TimeEntry[];     // 时间记录列表
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
}
```

### 7.3 任务评论模型 (TaskComment)

```typescript
interface TaskComment {
  id: number;                    // 评论ID
  content: string;               // 评论内容
  taskId: number;                // 任务ID
  userId: number;                // 用户ID
  user: User;                    // 用户信息
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
}
```

### 7.4 时间记录模型 (TimeEntry)

```typescript
interface TimeEntry {
  id: number;                    // 记录ID
  description?: string;          // 工作描述
  hours: number;                 // 工作时长
  date: Date;                    // 工作日期
  taskId: number;                // 任务ID
  userId: number;                // 用户ID
  task: Task;                    // 任务信息
  user: User;                    // 用户信息
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
}
```

## 8. 错误代码

### 8.1 认证相关错误

| 错误代码 | HTTP状态码 | 描述 |
|----------|------------|------|
| AUTH_001 | 401 | 访问令牌无效或已过期 |
| AUTH_002 | 401 | 刷新令牌无效或已过期 |
| AUTH_003 | 401 | 用户名或密码错误 |
| AUTH_004 | 403 | 账户已被禁用 |
| AUTH_005 | 403 | 账户已被暂停 |
| AUTH_006 | 403 | 权限不足 |

### 8.2 验证相关错误

| 错误代码 | HTTP状态码 | 描述 |
|----------|------------|------|
| VALID_001 | 422 | 请求参数验证失败 |
| VALID_002 | 422 | 邮箱格式不正确 |
| VALID_003 | 422 | 密码强度不足 |
| VALID_004 | 422 | 用户名已存在 |
| VALID_005 | 422 | 邮箱已存在 |

### 8.3 资源相关错误

| 错误代码 | HTTP状态码 | 描述 |
|----------|------------|------|
| RES_001 | 404 | 用户不存在 |
| RES_002 | 404 | 任务不存在 |
| RES_003 | 404 | 评论不存在 |
| RES_004 | 404 | 时间记录不存在 |
| RES_005 | 403 | 无权访问该资源 |

### 8.4 业务逻辑错误

| 错误代码 | HTTP状态码 | 描述 |
|----------|------------|------|
| BIZ_001 | 400 | 任务已完成，无法修改 |
| BIZ_002 | 400 | 无法删除已分配的任务 |
| BIZ_003 | 400 | 无法分配任务给已禁用的用户 |
| BIZ_004 | 400 | 时间记录日期不能是未来日期 |

### 8.5 系统错误

| 错误代码 | HTTP状态码 | 描述 |
|----------|------------|------|
| SYS_001 | 500 | 数据库连接失败 |
| SYS_002 | 500 | 内部服务器错误 |
| SYS_003 | 503 | 服务暂时不可用 |

## 9. 示例代码

### 9.1 JavaScript/TypeScript 客户端示例

```typescript
// API客户端配置
class ApiClient {
  private baseURL = 'http://localhost:3000/api';
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  }

  // 认证接口
  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setAccessToken(response.data.accessToken);
    return response.data;
  }

  // 获取任务列表
  async getTasks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<{ data: Task[]; pagination: any }>(`/tasks${queryString}`);
  }

  // 创建任务
  async createTask(taskData: {
    title: string;
    description?: string;
    priority: string;
    dueDate?: string;
    assigneeId?: number;
    tags?: string[];
  }) {
    return this.request<{ data: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // 更新任务状态
  async updateTaskStatus(taskId: number, status: string) {
    return this.request<{ data: Task }>(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

// 使用示例
const apiClient = new ApiClient();

// 登录
try {
  const { user, accessToken } = await apiClient.login({
    email: 'admin@example.com',
    password: 'password123',
  });
  console.log('登录成功:', user);
} catch (error) {
  console.error('登录失败:', error.message);
}

// 获取任务列表
try {
  const { data: tasks, pagination } = await apiClient.getTasks({
    page: 1,
    limit: 10,
    status: 'in_progress',
  });
  console.log('任务列表:', tasks);
  console.log('分页信息:', pagination);
} catch (error) {
  console.error('获取任务失败:', error.message);
}

// 创建任务
try {
  const { data: newTask } = await apiClient.createTask({
    title: '新任务',
    description: '任务描述',
    priority: 'medium',
    dueDate: '2024-01-31T23:59:59.000Z',
    tags: ['frontend', 'feature'],
  });
  console.log('任务创建成功:', newTask);
} catch (error) {
  console.error('创建任务失败:', error.message);
}
```

### 9.2 cURL 示例

```bash
# 用户登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# 获取任务列表
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10&status=in_progress" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 创建任务
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "新任务",
    "description": "任务描述",
    "priority": "medium",
    "dueDate": "2024-01-31T23:59:59.000Z",
    "tags": ["frontend", "feature"]
  }'

# 更新任务状态
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "completed"
  }'

# 添加任务评论
curl -X POST http://localhost:3000/api/tasks/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "content": "任务已完成测试"
  }'
```

## 10. 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 1.0.0 | 2024-01-01 | 初始版本，包含基础的用户管理、任务管理、认证等接口 |

## 11. 联系信息

- **开发团队**: 任务管理系统开发组
- **技术支持**: support@taskmanager.com
- **API问题反馈**: api-feedback@taskmanager.com