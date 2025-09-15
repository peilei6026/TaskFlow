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

---

# 补充API文档

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