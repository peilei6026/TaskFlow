# 任务管理系统 API 文档

## 概述

本文档描述了任务管理系统的所有API接口，包括认证、用户管理、任务管理、时间追踪、日历管理和系统管理等功能。

**基础信息：**
- 基础URL: `http://localhost:3000/api`
- 内容类型: `application/json`
- 字符编码: `UTF-8`

## 通用响应格式

所有API接口都遵循统一的响应格式：

### 成功响应
```json
{
  "success": true,
  "data": {
    // 具体数据内容
  },
  "pagination": {  // 分页接口特有
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 错误代码说明

| 错误代码 | 描述 |
|---------|------|
| AUTH_001 | 访问令牌无效或已过期 |
| AUTH_003 | 用户名或密码错误 |
| VALID_005 | 邮箱已存在 |
| RES_001 | 资源不存在 |
| RES_002 | 任务不存在 |

---

## 1. 认证相关接口

### 1.1 用户登录

**接口地址：** `POST /auth/login`

**请求参数：**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**响应示例：**
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
      "displayName": "系统管理员",
      "name": "张伟",
      "department": "技术部",
      "position": "系统管理员"
    },
    "accessToken": "ACCESS_TOKEN_STRING",
    "refreshToken": "REFRESH_TOKEN_STRING",
    "expiresIn": 900
  }
}
```

### 1.2 用户注册

**接口地址：** `POST /auth/register`

**请求参数：**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password",
  "name": "新用户",
  "department": "技术部",
  "position": "开发工程师"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "user",
    "status": "active",
    "name": "新用户",
    "department": "技术部",
    "position": "开发工程师",
    "createdAt": "2025-09-14T12:00:00.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 1.3 用户登出

**接口地址：** `POST /auth/logout`

**请求参数：** 无

**响应示例：**
```json
{
  "success": true,
  "message": "登出成功"
}
```

### 1.4 获取用户信息

**接口地址：** `GET /auth/profile`

**请求参数：** 无（需要在Header中携带Token）

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "displayName": "系统管理员",
    "name": "张伟",
    "department": "技术部",
    "position": "系统管理员",
    "lastLoginAt": "2025-09-13T09:00:00.000Z"
  }
}
```

---

## 2. 用户管理接口

### 2.1 获取用户列表

**接口地址：** `GET /users`

**查询参数：**
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `search`: 搜索关键词（匹配用户名、邮箱、显示名）
- `role`: 角色筛选（admin/user）
- `status`: 状态筛选（active/inactive）

**请求示例：**
```
GET /users?page=1&limit=10&search=张&role=admin&status=active
```

**响应示例：**
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
      "displayName": "系统管理员",
      "name": "张伟",
      "department": "技术部",
      "position": "系统管理员",
      "lastLoginAt": "2025-09-13T09:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

### 2.2 获取用户详情

**接口地址：** `GET /users/{id}`

**路径参数：**
- `id`: 用户ID

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "displayName": "系统管理员",
    "name": "张伟",
    "department": "技术部",
    "position": "系统管理员",
    "phone": "13800138000",
    "lastLoginAt": "2025-09-13T09:00:00.000Z",
    "lastLoginIp": "192.168.1.100",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2025-09-13T09:00:00.000Z"
  }
}
```

---

## 3. 任务管理接口

### 3.1 获取任务列表

**接口地址：** `GET /tasks`

**查询参数：**
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `status`: 任务状态（todo/in_progress/completed）
- `priority`: 优先级（low/medium/high）
- `search`: 搜索关键词
- `title`: 标题搜索
- `assigneeId`: 负责人ID
- `creatorId`: 创建者ID

**请求示例：**
```
GET /tasks?page=1&limit=10&status=in_progress&priority=high&assigneeId=2
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "实现用户认证功能",
      "description": "实现JWT认证和权限控制系统",
      "status": "in_progress",
      "priority": "high",
      "tags": ["backend", "security"],
      "dueDate": "2025-09-20T23:59:59.000Z",
      "completedAt": null,
      "estimatedHours": 8.0,
      "actualHours": 4.5,
      "assigneeId": 3,
      "createdBy": 1,
      "creatorId": 1,
      "createdAt": "2025-09-10T09:00:00.000Z",
      "updatedAt": "2025-09-12T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 40,
    "totalPages": 4
  }
}
```

### 3.2 获取任务详情

**接口地址：** `GET /tasks/{id}`

**路径参数：**
- `id`: 任务ID

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户认证功能",
    "description": "实现JWT认证和权限控制系统",
    "status": "in_progress",
    "priority": "high",
    "tags": ["backend", "security"],
    "dueDate": "2025-09-20T23:59:59.000Z",
    "completedAt": null,
    "estimatedHours": 8.0,
    "actualHours": 4.5,
    "assigneeId": 3,
    "createdBy": 1,
    "creatorId": 1,
    "createdAt": "2025-09-10T09:00:00.000Z",
    "updatedAt": "2025-09-12T10:00:00.000Z",
    "comments": [
      {
        "id": 1,
        "content": "开始认证功能的架构设计",
        "userId": 3,
        "user": {
          "id": 3,
          "name": "王小红"
        },
        "createdAt": "2025-09-10T10:00:00.000Z"
      }
    ],
    "timeEntries": [
      {
        "id": 1,
        "description": "设计认证系统架构",
        "hours": 2.0,
        "date": "2025-09-10",
        "userId": 3,
        "createdAt": "2025-09-10T11:00:00.000Z"
      }
    ]
  }
}
```

### 3.3 创建任务

**接口地址：** `POST /tasks`

**请求参数：**
```json
{
  "title": "新任务标题",
  "description": "任务详细描述",
  "priority": "high",
  "assigneeId": 3,
  "dueDate": "2025-09-25T23:59:59.000Z",
  "tags": ["backend", "api"],
  "estimatedHours": 8.0
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 41,
    "title": "新任务标题",
    "description": "任务详细描述",
    "status": "pending",
    "priority": "high",
    "assigneeId": 3,
    "dueDate": "2025-09-25T23:59:59.000Z",
    "tags": ["backend", "api"],
    "estimatedHours": 8.0,
    "actualHours": 0,
    "creatorId": 1,
    "createdBy": 1,
    "createdAt": "2025-09-14T12:00:00.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 3.4 更新任务

**接口地址：** `PUT /tasks/{id}`

**路径参数：**
- `id`: 任务ID

**请求参数：**
```json
{
  "title": "更新的任务标题",
  "description": "更新的任务描述",
  "priority": "medium",
  "assigneeId": 2,
  "dueDate": "2025-09-30T23:59:59.000Z"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新的任务标题",
    "description": "更新的任务描述",
    "status": "in_progress",
    "priority": "medium",
    "assigneeId": 2,
    "dueDate": "2025-09-30T23:59:59.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 3.5 更新任务状态

**接口地址：** `PATCH /tasks/{id}/status`

**路径参数：**
- `id`: 任务ID

**请求参数：**
```json
{
  "status": "completed"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "completed",
    "completedAt": "2025-09-14T12:00:00.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 3.6 删除任务

**接口地址：** `DELETE /tasks/{id}`

**路径参数：**
- `id`: 任务ID

**响应示例：**
```json
{
  "success": true,
  "message": "任务删除成功"
}
```

### 3.7 获取任务评论

**接口地址：** `GET /tasks/{id}/comments`

**路径参数：**
- `id`: 任务ID

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "开始认证功能的架构设计，预计需要2天时间完成基础框架",
      "taskId": 1,
      "userId": 3,
      "user": {
        "id": 3,
        "name": "王小红"
      },
      "createdAt": "2025-09-10T10:00:00.000Z",
      "updatedAt": "2025-09-10T10:00:00.000Z"
    }
  ]
}
```

### 3.8 添加任务评论

**接口地址：** `POST /tasks/{id}/comments`

**路径参数：**
- `id`: 任务ID

**请求参数：**
```json
{
  "content": "评论内容"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "content": "评论内容",
    "taskId": 1,
    "userId": 1,
    "user": {
      "id": 1,
      "name": "张伟"
    },
    "createdAt": "2025-09-14T12:00:00.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

---

## 4. 时间追踪接口

### 4.1 获取时间记录列表

**接口地址：** `GET /time-entries`

**查询参数：**
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `taskId`: 任务ID
- `userId`: 用户ID

**请求示例：**
```
GET /time-entries?page=1&limit=10&taskId=1&userId=3
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "description": "设计认证系统架构",
      "hours": 2.0,
      "date": "2025-09-10",
      "taskId": 1,
      "userId": 3,
      "task": {
        "id": 1,
        "title": "实现用户认证功能"
      },
      "user": {
        "id": 3,
        "name": "王小红"
      },
      "createdAt": "2025-09-10T11:00:00.000Z",
      "updatedAt": "2025-09-10T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 11,
    "totalPages": 2
  }
}
```

### 4.2 创建时间记录

**接口地址：** `POST /time-entries`

**请求参数：**
```json
{
  "description": "工作内容描述",
  "hours": 3.5,
  "date": "2025-09-14",
  "taskId": 1
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 12,
    "description": "工作内容描述",
    "hours": 3.5,
    "date": "2025-09-14",
    "taskId": 1,
    "userId": 1,
    "task": {
      "id": 1,
      "title": "实现用户认证功能"
    },
    "user": {
      "id": 1,
      "name": "张伟"
    },
    "createdAt": "2025-09-14T12:00:00.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 4.3 获取时间统计

**接口地址：** `GET /time-entries/stats`

**查询参数：**
- `userId`: 用户ID
- `period`: 统计周期（day/week/month），默认month

**请求示例：**
```
GET /time-entries/stats?userId=1&period=month
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalHours": 52.5,
    "averageHoursPerDay": 2.6,
    "daysWorked": 20,
    "totalEntries": 28,
    "efficiency": 88,
    "topTask": "移动端适配",
    "topTaskHours": 12.5,
    "dailyBreakdown": [
      {
        "date": "2025-09-09",
        "hours": 4.0,
        "efficiency": 90
      }
    ],
    "projectBreakdown": [
      {
        "project": "移动端适配",
        "hours": 12.5,
        "percentage": 24
      }
    ],
    "summary": {
      "totalHours": 52.5,
      "workingDays": 20,
      "averageDaily": 2.6,
      "efficiency": 88,
      "completedTasks": 17,
      "productivity": "high"
    },
    "trends": {
      "weekOverWeek": 5,
      "monthOverMonth": -8,
      "yearOverYear": 23
    }
  }
}
```

---

## 5. 日历管理接口

### 5.1 获取日历事件

**接口地址：** `GET /calendar/events`

**查询参数：**
- `start`: 开始日期（YYYY-MM-DD格式）
- `end`: 结束日期（YYYY-MM-DD格式）
- `type`: 事件类型（meeting/presentation/review/training）

**请求示例：**
```
GET /calendar/events?start=2025-09-01&end=2025-09-30&type=meeting
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "每周团队例会",
      "start": "2025-09-13T09:00:00",
      "end": "2025-09-13T10:00:00",
      "type": "meeting",
      "description": "讨论本周任务进度和遇到的问题",
      "location": "会议室A",
      "attendees": [1, 2, 3, 7],
      "taskId": null,
      "createdBy": 1,
      "createdAt": "2025-09-10T00:00:00.000Z",
      "updatedAt": "2025-09-10T00:00:00.000Z"
    }
  ]
}
```

### 5.2 创建日历事件

**接口地址：** `POST /calendar/events`

**请求参数：**
```json
{
  "title": "项目评审会议",
  "start": "2025-09-15T14:00:00",
  "end": "2025-09-15T16:00:00",
  "type": "review",
  "description": "评审项目进展和下一步计划",
  "location": "大会议室",
  "attendees": [1, 2, 3, 4],
  "taskId": 1
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "title": "项目评审会议",
    "start": "2025-09-15T14:00:00",
    "end": "2025-09-15T16:00:00",
    "type": "review",
    "description": "评审项目进展和下一步计划",
    "location": "大会议室",
    "attendees": [1, 2, 3, 4],
    "taskId": 1,
    "createdBy": 1,
    "createdAt": "2025-09-14T12:00:00.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 5.3 更新日历事件

**接口地址：** `PUT /calendar/events/{id}`

**路径参数：**
- `id`: 事件ID

**请求参数：**
```json
{
  "title": "更新的会议标题",
  "start": "2025-09-15T15:00:00",
  "end": "2025-09-15T17:00:00"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新的会议标题",
    "start": "2025-09-15T15:00:00",
    "end": "2025-09-15T17:00:00",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 5.4 删除日历事件

**接口地址：** `DELETE /calendar/events/{id}`

**路径参数：**
- `id`: 事件ID

**响应示例：**
```json
{
  "success": true,
  "message": "删除成功"
}
```

---

## 6. 四象限分析接口

### 6.1 获取四象限分析

**接口地址：** `GET /quadrant/analysis`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "urgent_important": [
      {
        "id": 1,
        "title": "修复生产环境bug",
        "description": "紧急修复影响用户的关键问题",
        "priority": "high",
        "status": "todo",
        "dueDate": "2025-09-15T12:00:00.000Z",
        "assigneeId": 3
      }
    ],
    "important_not_urgent": [
      {
        "id": 31,
        "title": "重要项目架构设计",
        "description": "为下个季度的重点项目进行技术架构设计",
        "priority": "high",
        "status": "todo",
        "dueDate": "2025-09-25T23:59:59.000Z",
        "assigneeId": 2
      }
    ],
    "urgent_not_important": [
      {
        "id": 30,
        "title": "日常代码review",
        "description": "对团队提交的代码进行review",
        "priority": "low",
        "status": "in_progress",
        "dueDate": "2025-09-15T17:00:00.000Z",
        "assigneeId": 2
      }
    ],
    "not_urgent_not_important": [
      {
        "id": 32,
        "title": "整理技术文档",
        "description": "整理和更新项目技术文档",
        "priority": "low",
        "status": "todo",
        "dueDate": "2025-10-10T23:59:59.000Z",
        "assigneeId": 2
      }
    ],
    "archived": []
  }
}
```

### 6.2 移动任务到不同象限

**接口地址：** `POST /quadrant/move`

**请求参数：**
```json
{
  "taskId": 1,
  "quadrant": "urgent_important"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "priority": "high",
    "dueDate": "2025-09-15T18:00:00.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 6.3 归档任务

**接口地址：** `POST /quadrant/archive`

**请求参数：**
```json
{
  "taskId": 1
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "archived": true,
    "archivedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 6.4 取消归档任务

**接口地址：** `POST /quadrant/unarchive`

**请求参数：**
```json
{
  "taskId": 1,
  "targetQuadrant": "not_urgent_important"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "archived": false,
    "archivedAt": null,
    "priority": "high",
    "dueDate": "2025-09-21T23:59:59.000Z",
    "updatedAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 6.5 删除归档任务

**接口地址：** `DELETE /quadrant/archived/{id}`

**路径参数：**
- `id`: 任务ID

**响应示例：**
```json
{
  "success": true,
  "message": "任务已永久删除"
}
```

---

## 7. 系统管理接口

### 7.1 获取系统设置

**接口地址：** `GET /system/settings`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "general": {
      "siteName": "任务管理系统",
      "siteDescription": "高效的团队任务管理平台",
      "timezone": "Asia/Shanghai",
      "language": "zh-CN",
      "dateFormat": "YYYY-MM-DD",
      "timeFormat": "24h"
    },
    "notification": {
      "emailEnabled": true,
      "smsEnabled": false,
      "pushEnabled": true,
      "taskReminder": true,
      "deadlineAlert": true,
      "weeklyReport": true
    },
    "security": {
      "passwordMinLength": 6,
      "passwordComplexity": false,
      "sessionTimeout": 24,
      "maxLoginAttempts": 5,
      "twoFactorAuth": false
    },
    "backup": {
      "autoBackup": true,
      "backupFrequency": "daily",
      "retentionDays": 30,
      "lastBackup": "2025-09-12T02:00:00.000Z"
    }
  }
}
```

### 7.2 更新系统设置

**接口地址：** `PUT /system/settings`

**请求参数：**
```json
{
  "general": {
    "siteName": "新的系统名称",
    "timezone": "Asia/Shanghai"
  },
  "notification": {
    "emailEnabled": false,
    "pushEnabled": true
  }
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "general": {
      "siteName": "新的系统名称",
      "siteDescription": "高效的团队任务管理平台",
      "timezone": "Asia/Shanghai",
      "language": "zh-CN",
      "dateFormat": "YYYY-MM-DD",
      "timeFormat": "24h"
    },
    "notification": {
      "emailEnabled": false,
      "smsEnabled": false,
      "pushEnabled": true,
      "taskReminder": true,
      "deadlineAlert": true,
      "weeklyReport": true
    }
  }
}
```

### 7.3 创建系统备份

**接口地址：** `POST /system/backup`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "filename": "backup_2025-09-14.sql",
    "size": "2.8MB",
    "createdAt": "2025-09-14T12:00:00.000Z"
  }
}
```

### 7.4 获取系统统计

**接口地址：** `GET /system/stats`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 9,
      "active": 8,
      "inactive": 1
    },
    "tasks": {
      "total": 40,
      "completed": 8,
      "pending": 32,
      "completionRate": 20
    },
    "events": {
      "total": 10,
      "thisWeek": 3
    },
    "storage": {
      "used": "15.2MB",
      "total": "100MB",
      "usage": 15.2
    }
  }
}
```

---

## 权限说明

### 用户角色
- **admin**: 系统管理员，拥有所有权限
- **user**: 普通用户，有限权限

### 权限控制规则

#### 任务管理权限
1. **任务状态修改**: 只有任务负责人或管理员可以修改任务状态
2. **任务编辑**: 只有任务创建者或管理员可以编辑任务内容
3. **任务删除**: 只有任务创建者或管理员可以删除任务
4. **任务查看**: 所有用户都可以查看任务列表和详情

#### 用户管理权限
1. **用户列表**: 所有用户都可以查看用户列表
2. **用户详情**: 所有用户都可以查看用户详情
3. **用户管理**: 只有管理员可以进行用户管理操作

#### 系统管理权限
1. **系统设置**: 只有管理员可以查看和修改系统设置
2. **系统备份**: 只有管理员可以创建系统备份
3. **系统统计**: 只有管理员可以查看系统统计数据

---

## 数据模型

### 用户（User）
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  displayName: string;
  name: string;
  avatar?: string;
  phone?: string;
  department: string;
  position: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 任务（Task）
```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate?: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours: number;
  assigneeId: number;
  createdBy: number;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}
```

### 时间记录（TimeEntry）
```typescript
interface TimeEntry {
  id: number;
  description: string;
  hours: number;
  date: string;
  taskId: number;
  userId: number;
  task: Task;
  user: User;
  createdAt: string;
  updatedAt: string;
}
```

### 日历事件（CalendarEvent）
```typescript
interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'presentation' | 'review' | 'training';
  description?: string;
  location?: string;
  attendees: number[];
  taskId?: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}
```

### 任务评论（Comment）
```typescript
interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  user: User;
  createdAt: string;
  updatedAt: string;
}
```

---

## 开发说明

1. 所有接口都是Mock实现，用于前端开发和测试
2. 接口响应会有200-600ms的模拟网络延迟
3. 认证基于localStorage存储，刷新页面后会自动恢复登录状态
4. 所有日期时间均使用ISO 8601格式
5. 分页参数支持灵活配置，支持总数统计

---

## 更新日志

### v1.0.0 (2025-09-14)
- 初始版本发布
- 完整的认证、用户管理、任务管理功能
- 时间追踪和统计功能
- 日历管理功能
- 四象限任务分析功能
- 系统管理功能