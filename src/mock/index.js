import Mock from 'mockjs';

// 配置Mock.js
Mock.setup({
  timeout: '200-600' // 模拟网络延迟
});

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    displayName: '系统管理员',
    name: '张伟',
    avatar: null,
    phone: '13800138000',
    department: '技术部',
    position: '系统管理员',
    lastLoginAt: '2025-09-13T09:00:00.000Z',
    lastLoginIp: '192.168.1.100',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2025-09-13T09:00:00.000Z'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    displayName: '前端工程师',
    name: '李明',
    avatar: null,
    phone: '13800138001',
    department: '技术部',
    position: '前端工程师',
    lastLoginAt: '2025-09-13T08:30:00.000Z',
    lastLoginIp: '192.168.1.101',
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2025-09-13T08:30:00.000Z'
  },
  {
    id: 3,
    username: 'backend_dev',
    email: 'backend@example.com',
    role: 'user',
    status: 'active',
    displayName: '后端工程师',
    name: '王小红',
    avatar: null,
    phone: '13800138002',
    department: '技术部',
    position: '后端工程师',
    lastLoginAt: '2025-09-12T17:45:00.000Z',
    lastLoginIp: '192.168.1.102',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2025-09-12T17:45:00.000Z'
  },
  {
    id: 4,
    username: 'product_manager',
    email: 'pm@example.com',
    role: 'user',
    status: 'active',
    displayName: '产品经理',
    name: '陈佳',
    avatar: null,
    phone: '13800138003',
    department: '产品部',
    position: '产品经理',
    lastLoginAt: '2025-09-13T07:20:00.000Z',
    lastLoginIp: '192.168.1.103',
    createdAt: '2023-03-01T00:00:00.000Z',
    updatedAt: '2025-09-13T07:20:00.000Z'
  },
  {
    id: 5,
    username: 'ui_designer',
    email: 'designer@example.com',
    role: 'user',
    status: 'active',
    displayName: 'UI设计师',
    name: '刘娟',
    avatar: null,
    phone: '13800138004',
    department: '设计部',
    position: 'UI/UX设计师',
    lastLoginAt: '2025-09-12T16:30:00.000Z',
    lastLoginIp: '192.168.1.104',
    createdAt: '2023-03-15T00:00:00.000Z',
    updatedAt: '2025-09-12T16:30:00.000Z'
  },
  {
    id: 6,
    username: 'qa_tester',
    email: 'qa@example.com',
    role: 'user',
    status: 'active',
    displayName: '测试工程师',
    name: '杨磊',
    avatar: null,
    phone: '13800138005',
    department: '质量部',
    position: '测试工程师',
    lastLoginAt: '2025-09-13T08:00:00.000Z',
    lastLoginIp: '192.168.1.105',
    createdAt: '2023-04-01T00:00:00.000Z',
    updatedAt: '2025-09-13T08:00:00.000Z'
  },
  {
    id: 7,
    username: 'team_lead',
    email: 'lead@example.com',
    role: 'user',
    status: 'active',
    displayName: '技术主管',
    name: '马强',
    avatar: null,
    phone: '13800138006',
    department: '技术部',
    position: '技术主管',
    lastLoginAt: '2025-09-13T07:45:00.000Z',
    lastLoginIp: '192.168.1.106',
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2025-09-13T07:45:00.000Z'
  },
  {
    id: 8,
    username: 'intern_dev',
    email: 'intern@example.com',
    role: 'user',
    status: 'active',
    displayName: '实习生',
    name: '周小虎',
    avatar: null,
    phone: '13800138007',
    department: '技术部',
    position: '实习生',
    lastLoginAt: '2025-09-12T18:00:00.000Z',
    lastLoginIp: '192.168.1.107',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-09-12T18:00:00.000Z'
  },
  {
    id: 9,
    username: 'inactive_user',
    email: 'inactive@example.com',
    role: 'user',
    status: 'inactive',
    displayName: '离职员工',
    name: '赵离职',
    avatar: null,
    phone: '13800138008',
    department: '技术部',
    position: '前端工程师',
    lastLoginAt: '2025-07-15T18:00:00.000Z',
    lastLoginIp: '192.168.1.108',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-07-20T18:00:00.000Z'
  }
];

// 模拟任务数据
const tasks = [
  {
    id: 1,
    title: '实现用户认证功能',
    description: '实现JWT认证和权限控制系统，包括登录、注册、权限验证等核心功能',
    status: 'in_progress',
    priority: 'high',
    tags: ['backend', 'security'],
    dueDate: '2025-09-20T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 8.0,
    actualHours: 4.5,
    assigneeId: 3,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-10T09:00:00.000Z',
    updatedAt: '2025-09-12T10:00:00.000Z'
  },
  {
    id: 2,
    title: '设计任务管理界面',
    description: '使用Ant Design设计现代化的任务管理界面，包括列表、卡片、过滤等功能',
    status: 'completed',
    priority: 'medium',
    tags: ['frontend', 'ui'],
    dueDate: '2025-09-15T23:59:59.000Z',
    completedAt: '2025-09-12T15:30:00.000Z',
    estimatedHours: 12.0,
    actualHours: 10.0,
    assigneeId: 2,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-08T10:00:00.000Z',
    updatedAt: '2025-09-12T15:30:00.000Z'
  },
  {
    id: 3,
    title: '优化数据库查询性能',
    description: '优化任务列表和用户查询的性能，添加必要的索引和查询优化',
    status: 'todo',
    priority: 'medium',
    tags: ['backend', 'performance'],
    dueDate: '2025-09-25T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 6.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-11T14:00:00.000Z',
    updatedAt: '2025-09-11T14:00:00.000Z'
  },
  {
    id: 4,
    title: '移动端适配',
    description: '对任务管理系统进行移动端响应式适配，确保在手机和平板上的良好体验',
    status: 'in_progress',
    priority: 'high',
    tags: ['frontend', 'mobile'],
    dueDate: '2025-09-18T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 16.0,
    actualHours: 8.0,
    assigneeId: 2,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-09T11:00:00.000Z',
    updatedAt: '2025-09-13T09:00:00.000Z'
  },
  {
    id: 5,
    title: 'API文档编写',
    description: '编写完整的API文档，包括接口说明、参数定义、示例代码等',
    status: 'todo',
    priority: 'low',
    tags: ['documentation', 'api'],
    dueDate: '2025-09-30T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 4.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-12T16:00:00.000Z',
    updatedAt: '2025-09-12T16:00:00.000Z'
  },
  {
    id: 6,
    title: '系统性能测试',
    description: '对整个系统进行压力测试和性能测试，确保系统稳定性',
    status: 'in_progress',
    priority: 'high',
    tags: ['testing', 'performance'],
    dueDate: '2025-09-22T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 10.0,
    actualHours: 3.0,
    assigneeId: 6,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-11T10:00:00.000Z',
    updatedAt: '2025-09-13T08:00:00.000Z'
  },
  {
    id: 7,
    title: '用户界面设计优化',
    description: '根据用户反馈优化界面设计，提升用户体验和视觉效果',
    status: 'completed',
    priority: 'medium',
    tags: ['design', 'ui'],
    dueDate: '2025-09-10T23:59:59.000Z',
    completedAt: '2025-09-09T17:00:00.000Z',
    estimatedHours: 8.0,
    actualHours: 7.5,
    assigneeId: 5,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-05T14:00:00.000Z',
    updatedAt: '2025-09-09T17:00:00.000Z'
  },
  {
    id: 8,
    title: '数据备份策略实施',
    description: '实施自动化数据备份策略，确保数据安全和可恢复性',
    status: 'todo',
    priority: 'high',
    tags: ['backend', 'security'],
    dueDate: '2025-09-17T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 5.0,
    actualHours: 0,
    assigneeId: 1,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-12T09:00:00.000Z',
    updatedAt: '2025-09-12T09:00:00.000Z'
  },
  {
    id: 9,
    title: '错误日志监控系统',
    description: '建立错误日志监控和告警系统，及时发现和处理系统问题',
    status: 'in_progress',
    priority: 'medium',
    tags: ['backend', 'monitoring'],
    dueDate: '2025-09-28T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 12.0,
    actualHours: 4.0,
    assigneeId: 3,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-08T15:00:00.000Z',
    updatedAt: '2025-09-13T10:00:00.000Z'
  },
  {
    id: 10,
    title: '新人培训材料准备',
    description: '准备新员工技术培训材料和入职指南，包括代码规范、开发流程等',
    status: 'completed',
    priority: 'low',
    tags: ['training', 'documentation'],
    dueDate: '2025-09-05T23:59:59.000Z',
    completedAt: '2025-09-04T16:00:00.000Z',
    estimatedHours: 6.0,
    actualHours: 5.5,
    assigneeId: 7,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-08-28T10:00:00.000Z',
    updatedAt: '2025-09-04T16:00:00.000Z'
  },
  {
    id: 11,
    title: '代码审查流程改进',
    description: '改进代码审查流程，制定更完善的审查标准和流程规范',
    status: 'todo',
    priority: 'low',
    tags: ['process', 'quality'],
    dueDate: '2025-10-01T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 3.0,
    actualHours: 0,
    assigneeId: 7,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-13T11:00:00.000Z',
    updatedAt: '2025-09-13T11:00:00.000Z'
  },
  {
    id: 12,
    title: '实习生指导计划',
    description: '制定实习生培养计划，包括技术指导、项目分配和成长规划',
    status: 'in_progress',
    priority: 'medium',
    tags: ['training', 'mentoring'],
    dueDate: '2025-09-20T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 4.0,
    actualHours: 1.5,
    assigneeId: 2,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-10T13:00:00.000Z',
    updatedAt: '2025-09-13T09:30:00.000Z'
  },
  {
    id: 13,
    title: '前端性能优化',
    description: '优化页面加载速度，减少首屏渲染时间，提升用户体验',
    status: 'todo',
    priority: 'high',
    tags: ['frontend', 'performance'],
    dueDate: '2025-09-16T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 6.0,
    actualHours: 0,
    assigneeId: 2,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-13T14:00:00.000Z',
    updatedAt: '2025-09-13T14:00:00.000Z'
  },
  {
    id: 14,
    title: '用户反馈收集',
    description: '收集用户对新功能的反馈意见，为后续优化提供依据',
    status: 'in_progress',
    priority: 'medium',
    tags: ['user-research', 'feedback'],
    dueDate: '2025-09-25T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 4.0,
    actualHours: 1.0,
    assigneeId: 4,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-12T11:00:00.000Z',
    updatedAt: '2025-09-13T16:00:00.000Z'
  },
  {
    id: 15,
    title: '代码重构优化',
    description: '重构部分老旧代码，提升代码质量和可维护性',
    status: 'todo',
    priority: 'low',
    tags: ['refactor', 'quality'],
    dueDate: '2025-10-05T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 8.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-13T12:00:00.000Z',
    updatedAt: '2025-09-13T12:00:00.000Z'
  },
  {
    id: 16,
    title: '邮件通知功能',
    description: '实现任务状态变更时的邮件通知功能',
    status: 'todo',
    priority: 'medium',
    tags: ['backend', 'notification'],
    dueDate: '2025-09-19T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 5.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-13T13:30:00.000Z',
    updatedAt: '2025-09-13T13:30:00.000Z'
  },
  {
    id: 17,
    title: 'UI组件库更新',
    description: '更新UI组件库版本，修复已知问题',
    status: 'completed',
    priority: 'low',
    tags: ['frontend', 'maintenance'],
    dueDate: '2025-09-12T23:59:59.000Z',
    completedAt: '2025-09-11T18:00:00.000Z',
    estimatedHours: 2.0,
    actualHours: 1.5,
    assigneeId: 2,
    createdBy: 2,
    creatorId: 2,
    createdAt: '2025-09-09T15:00:00.000Z',
    updatedAt: '2025-09-11T18:00:00.000Z'
  },
  {
    id: 18,
    title: '数据导出功能',
    description: '实现任务数据导出到Excel功能，方便数据分析',
    status: 'in_progress',
    priority: 'low',
    tags: ['feature', 'export'],
    dueDate: '2025-09-30T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 6.0,
    actualHours: 2.0,
    assigneeId: 8,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-11T16:00:00.000Z',
    updatedAt: '2025-09-13T14:30:00.000Z'
  },
  {
    id: 19,
    title: '客户端缓存优化',
    description: '实现本地缓存策略，提升应用响应速度和离线体验',
    status: 'todo',
    priority: 'high',
    tags: ['frontend', 'performance'],
    dueDate: '2025-09-17T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 8.0,
    actualHours: 0,
    assigneeId: 2,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-13T16:00:00.000Z',
    updatedAt: '2025-09-13T16:00:00.000Z'
  },
  {
    id: 20,
    title: '多语言支持',
    description: '为系统添加国际化支持，支持中英文切换',
    status: 'in_progress',
    priority: 'medium',
    tags: ['frontend', 'i18n'],
    dueDate: '2025-10-01T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 12.0,
    actualHours: 3.0,
    assigneeId: 2,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-12T14:00:00.000Z',
    updatedAt: '2025-09-13T17:00:00.000Z'
  },
  {
    id: 21,
    title: 'API速率限制',
    description: '实现API请求频率限制，防止恶意攻击和资源滥用',
    status: 'todo',
    priority: 'high',
    tags: ['backend', 'security'],
    dueDate: '2025-09-20T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 4.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-13T10:30:00.000Z',
    updatedAt: '2025-09-13T10:30:00.000Z'
  },
  {
    id: 22,
    title: '移动端推送通知',
    description: '集成移动端推送服务，实现任务提醒和状态通知',
    status: 'todo',
    priority: 'medium',
    tags: ['mobile', 'notification'],
    dueDate: '2025-09-28T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 10.0,
    actualHours: 0,
    assigneeId: 2,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-13T15:20:00.000Z',
    updatedAt: '2025-09-13T15:20:00.000Z'
  },
  {
    id: 23,
    title: '数据分析仪表板',
    description: '创建管理员数据分析面板，展示项目进度和团队效率指标',
    status: 'in_progress',
    priority: 'low',
    tags: ['analytics', 'dashboard'],
    dueDate: '2025-10-15T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 16.0,
    actualHours: 5.0,
    assigneeId: 2,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-10T11:00:00.000Z',
    updatedAt: '2025-09-13T18:00:00.000Z'
  },
  {
    id: 24,
    title: '自动化测试套件',
    description: '建立完整的自动化测试体系，包括单元测试和集成测试',
    status: 'completed',
    priority: 'high',
    tags: ['testing', 'automation'],
    dueDate: '2025-09-12T23:59:59.000Z',
    completedAt: '2025-09-11T20:00:00.000Z',
    estimatedHours: 20.0,
    actualHours: 18.5,
    assigneeId: 6,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-05T09:00:00.000Z',
    updatedAt: '2025-09-11T20:00:00.000Z'
  },
  {
    id: 25,
    title: '第三方集成接口',
    description: '对接钉钉、企业微信等第三方平台，实现消息同步',
    status: 'todo',
    priority: 'low',
    tags: ['integration', 'api'],
    dueDate: '2025-11-01T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 14.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-13T16:45:00.000Z',
    updatedAt: '2025-09-13T16:45:00.000Z'
  },
  {
    id: 26,
    title: 'UI设计系统完善',
    description: '建立统一的设计语言和组件规范，提升界面一致性',
    status: 'in_progress',
    priority: 'medium',
    tags: ['design', 'system'],
    dueDate: '2025-09-25T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 12.0,
    actualHours: 7.0,
    assigneeId: 5,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-08T13:00:00.000Z',
    updatedAt: '2025-09-13T19:00:00.000Z'
  },
  {
    id: 27,
    title: '数据库性能调优',
    description: '分析数据库查询性能，优化慢查询和建立合适索引',
    status: 'todo',
    priority: 'high',
    tags: ['database', 'performance'],
    dueDate: '2025-09-22T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 8.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-13T17:30:00.000Z',
    updatedAt: '2025-09-13T17:30:00.000Z'
  },
  {
    id: 28,
    title: '用户体验研究',
    description: '进行用户调研和可用性测试，收集改进建议',
    status: 'completed',
    priority: 'medium',
    tags: ['ux', 'research'],
    dueDate: '2025-09-10T23:59:59.000Z',
    completedAt: '2025-09-09T16:30:00.000Z',
    estimatedHours: 6.0,
    actualHours: 5.5,
    assigneeId: 5,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-03T10:00:00.000Z',
    updatedAt: '2025-09-09T16:30:00.000Z'
  },
  {
    id: 29,
    title: '紧急修复生产环境bug',
    description: '生产环境出现严重bug，需要立即修复',
    status: 'todo',
    priority: 'high',
    tags: ['hotfix', 'urgent'],
    dueDate: '2025-09-14T18:00:00.000Z', // 今天
    completedAt: null,
    estimatedHours: 4.0,
    actualHours: 0,
    assigneeId: 2, // 李明
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-14T10:00:00.000Z',
    updatedAt: '2025-09-14T10:00:00.000Z'
  },
  {
    id: 30,
    title: '日常代码review',
    description: '对团队提交的代码进行review，确保代码质量',
    status: 'in_progress',
    priority: 'low',
    tags: ['review', 'daily'],
    dueDate: '2025-09-15T17:00:00.000Z', // 明天
    completedAt: null,
    estimatedHours: 2.0,
    actualHours: 0.5,
    assigneeId: 2,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-13T09:00:00.000Z',
    updatedAt: '2025-09-14T11:00:00.000Z'
  },
  {
    id: 31,
    title: '重要项目架构设计',
    description: '为下个季度的重点项目进行技术架构设计',
    status: 'todo',
    priority: 'high',
    tags: ['architecture', 'planning'],
    dueDate: '2025-09-25T23:59:59.000Z', // 一周后
    completedAt: null,
    estimatedHours: 16.0,
    actualHours: 0,
    assigneeId: 2,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-14T14:00:00.000Z',
    updatedAt: '2025-09-14T14:00:00.000Z'
  },
  {
    id: 32,
    title: '整理技术文档',
    description: '整理和更新项目技术文档，提升团队协作效率',
    status: 'todo',
    priority: 'low',
    tags: ['documentation', 'maintenance'],
    dueDate: '2025-10-10T23:59:59.000Z', // 较远的未来
    completedAt: null,
    estimatedHours: 8.0,
    actualHours: 0,
    assigneeId: 2,
    createdBy: 7,
    creatorId: 7,
    createdAt: '2025-09-14T15:00:00.000Z',
    updatedAt: '2025-09-14T15:00:00.000Z'
  },
  // 为后端开发人员（王小红，ID=3）添加任务
  {
    id: 33,
    title: '数据库紧急维护',
    description: '数据库出现性能问题，需要紧急优化',
    status: 'in_progress',
    priority: 'high',
    tags: ['database', 'urgent'],
    dueDate: '2025-09-15T12:00:00.000Z', // 明天中午
    completedAt: null,
    estimatedHours: 6.0,
    actualHours: 2.0,
    assigneeId: 3,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-14T08:00:00.000Z',
    updatedAt: '2025-09-14T10:30:00.000Z'
  },
  {
    id: 34,
    title: '回复客户紧急邮件',
    description: '处理客户的紧急技术咨询邮件',
    status: 'todo',
    priority: 'medium',
    tags: ['support', 'communication'],
    dueDate: '2025-09-14T16:00:00.000Z', // 今天下午
    completedAt: null,
    estimatedHours: 1.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-14T11:00:00.000Z',
    updatedAt: '2025-09-14T11:00:00.000Z'
  },
  {
    id: 35,
    title: '新功能开发规划',
    description: '规划下个版本的新功能开发计划',
    status: 'todo',
    priority: 'high',
    tags: ['planning', 'development'],
    dueDate: '2025-09-20T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 8.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-13T16:00:00.000Z',
    updatedAt: '2025-09-13T16:00:00.000Z'
  },
  {
    id: 36,
    title: '学习新技术文档',
    description: '阅读和学习最新的技术文档，提升技能',
    status: 'todo',
    priority: 'low',
    tags: ['learning', 'self-improvement'],
    dueDate: '2025-10-15T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 4.0,
    actualHours: 0,
    assigneeId: 3,
    createdBy: 3,
    creatorId: 3,
    createdAt: '2025-09-14T16:00:00.000Z',
    updatedAt: '2025-09-14T16:00:00.000Z'
  },
  // 为产品经理（陈佳，ID=4）添加任务
  {
    id: 37,
    title: '客户需求紧急评估',
    description: '评估客户提出的紧急需求变更',
    status: 'todo',
    priority: 'high',
    tags: ['requirements', 'urgent'],
    dueDate: '2025-09-15T10:00:00.000Z',
    completedAt: null,
    estimatedHours: 3.0,
    actualHours: 0,
    assigneeId: 4,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-14T13:00:00.000Z',
    updatedAt: '2025-09-14T13:00:00.000Z'
  },
  {
    id: 38,
    title: '市场调研报告整理',
    description: '整理最新的市场调研数据，形成分析报告',
    status: 'in_progress',
    priority: 'medium',
    tags: ['research', 'analysis'],
    dueDate: '2025-09-18T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 6.0,
    actualHours: 2.5,
    assigneeId: 4,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-12T14:00:00.000Z',
    updatedAt: '2025-09-14T15:30:00.000Z'
  },
  {
    id: 39,
    title: '产品路线图规划',
    description: '制定下一年的产品发展路线图',
    status: 'todo',
    priority: 'high',
    tags: ['strategy', 'planning'],
    dueDate: '2025-09-30T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 12.0,
    actualHours: 0,
    assigneeId: 4,
    createdBy: 1,
    creatorId: 1,
    createdAt: '2025-09-10T10:00:00.000Z',
    updatedAt: '2025-09-10T10:00:00.000Z'
  },
  {
    id: 40,
    title: '用户手册更新',
    description: '更新产品用户手册，添加新功能说明',
    status: 'todo',
    priority: 'low',
    tags: ['documentation', 'user-guide'],
    dueDate: '2025-10-20T23:59:59.000Z',
    completedAt: null,
    estimatedHours: 4.0,
    actualHours: 0,
    assigneeId: 4,
    createdBy: 4,
    creatorId: 4,
    createdAt: '2025-09-14T17:00:00.000Z',
    updatedAt: '2025-09-14T17:00:00.000Z'
  }];

// 模拟评论数据
const comments = [
  {
    id: 1,
    content: '开始认证功能的架构设计，预计需要2天时间完成基础框架',
    taskId: 1,
    userId: 3,
    user: users[2],
    createdAt: '2025-09-10T10:00:00.000Z',
    updatedAt: '2025-09-10T10:00:00.000Z'
  },
  {
    id: 2,
    content: 'JWT集成已完成，正在进行权限验证模块的开发',
    taskId: 1,
    userId: 3,
    user: users[2],
    createdAt: '2025-09-12T15:00:00.000Z',
    updatedAt: '2025-09-12T15:00:00.000Z'
  },
  {
    id: 3,
    content: '界面设计稿已提交，等待产品确认',
    taskId: 2,
    userId: 2,
    user: users[1],
    createdAt: '2025-09-11T16:30:00.000Z',
    updatedAt: '2025-09-11T16:30:00.000Z'
  },
  {
    id: 4,
    content: '移动端适配遇到一些兼容性问题，需要额外调试时间',
    taskId: 4,
    userId: 2,
    user: users[1],
    createdAt: '2025-09-13T09:15:00.000Z',
    updatedAt: '2025-09-13T09:15:00.000Z'
  },
  {
    id: 5,
    content: '缓存策略设计已完成，准备开始实现',
    taskId: 19,
    userId: 2,
    user: users[1],
    createdAt: '2025-09-13T16:30:00.000Z',
    updatedAt: '2025-09-13T16:30:00.000Z'
  },
  {
    id: 6,
    content: '国际化框架选型调研完成，准备引入react-i18next',
    taskId: 20,
    userId: 2,
    user: users[1],
    createdAt: '2025-09-13T17:30:00.000Z',
    updatedAt: '2025-09-13T17:30:00.000Z'
  },
  {
    id: 7,
    content: '测试套件已通过验收，代码覆盖率达到85%',
    taskId: 24,
    userId: 6,
    user: users[5],
    createdAt: '2025-09-11T19:00:00.000Z',
    updatedAt: '2025-09-11T19:00:00.000Z'
  },
  {
    id: 8,
    content: '设计规范文档初稿完成，等待团队review',
    taskId: 26,
    userId: 5,
    user: users[4],
    createdAt: '2025-09-13T18:30:00.000Z',
    updatedAt: '2025-09-13T18:30:00.000Z'
  }
];

// 模拟时间记录数据
const timeEntries = [
  {
    id: 1,
    description: '设计认证系统架构',
    hours: 2.0,
    date: '2025-09-10',
    taskId: 1,
    userId: 3,
    task: tasks[0],
    user: users[2],
    createdAt: '2025-09-10T11:00:00.000Z',
    updatedAt: '2025-09-10T11:00:00.000Z'
  },
  {
    id: 2,
    description: '实现JWT登录接口',
    hours: 2.5,
    date: '2025-09-12',
    taskId: 1,
    userId: 3,
    task: tasks[0],
    user: users[2],
    createdAt: '2025-09-12T16:00:00.000Z',
    updatedAt: '2025-09-12T16:00:00.000Z'
  },
  {
    id: 3,
    description: '移动端界面适配调试',
    hours: 4.0,
    date: '2025-09-13',
    taskId: 4,
    userId: 2,
    task: tasks[3],
    user: users[1],
    createdAt: '2025-09-13T10:00:00.000Z',
    updatedAt: '2025-09-13T10:00:00.000Z'
  },
  {
    id: 4,
    description: '系统性能基准测试',
    hours: 3.0,
    date: '2025-09-13',
    taskId: 6,
    userId: 6,
    task: tasks[5],
    user: users[5],
    createdAt: '2025-09-13T08:30:00.000Z',
    updatedAt: '2025-09-13T08:30:00.000Z'
  },
  {
    id: 5,
    description: '错误监控系统配置',
    hours: 2.0,
    date: '2025-09-12',
    taskId: 9,
    userId: 3,
    task: tasks[8],
    user: users[2],
    createdAt: '2025-09-12T14:00:00.000Z',
    updatedAt: '2025-09-12T14:00:00.000Z'
  },
  {
    id: 6,
    description: '新人培训材料整理',
    hours: 1.5,
    date: '2025-09-13',
    taskId: 12,
    userId: 2,
    task: tasks[11],
    user: users[1],
    createdAt: '2025-09-13T09:30:00.000Z',
    updatedAt: '2025-09-13T09:30:00.000Z'
  },
  {
    id: 7,
    description: '缓存架构设计和技术调研',
    hours: 4.0,
    date: '2025-09-13',
    taskId: 19,
    userId: 2,
    task: tasks[18], // 客户端缓存优化
    user: users[1],
    createdAt: '2025-09-13T16:30:00.000Z',
    updatedAt: '2025-09-13T16:30:00.000Z'
  },
  {
    id: 8,
    description: '国际化框架集成和配置',
    hours: 3.0,
    date: '2025-09-13',
    taskId: 20,
    userId: 2,
    task: tasks[19], // 多语言支持
    user: users[1],
    createdAt: '2025-09-13T17:30:00.000Z',
    updatedAt: '2025-09-13T17:30:00.000Z'
  },
  {
    id: 9,
    description: '自动化测试脚本编写',
    hours: 6.0,
    date: '2025-09-11',
    taskId: 24,
    userId: 6,
    task: tasks[23], // 自动化测试套件
    user: users[5],
    createdAt: '2025-09-11T19:00:00.000Z',
    updatedAt: '2025-09-11T19:00:00.000Z'
  },
  {
    id: 10,
    description: 'UI设计规范整理和文档编写',
    hours: 5.0,
    date: '2025-09-13',
    taskId: 26,
    userId: 5,
    task: tasks[25], // UI设计系统完善
    user: users[4],
    createdAt: '2025-09-13T18:30:00.000Z',
    updatedAt: '2025-09-13T18:30:00.000Z'
  },
  {
    id: 11,
    description: '数据分析功能开发',
    hours: 3.5,
    date: '2025-09-13',
    taskId: 23,
    userId: 2,
    task: tasks[22], // 数据分析仪表板
    user: users[1],
    createdAt: '2025-09-13T18:00:00.000Z',
    updatedAt: '2025-09-13T18:00:00.000Z'
  }
];

// 当前登录用户
let currentUser = null;
let accessToken = null;

// 认证接口
Mock.mock('/api/auth/login', 'post', (options) => {
  const { email, password } = JSON.parse(options.body);

  // 简单的认证逻辑
  const user = users.find(u => u.email === email);
  if (!user || (user.password && user.password !== password) || (!user.password && password !== 'password')) {
    return {
      success: false,
      error: {
        code: 'AUTH_003',
        message: '用户名或密码错误'
      }
    };
  }

  currentUser = user;
  accessToken = Mock.Random.string('upper', 32);

  // 将用户信息存储到localStorage以支持页面刷新后的状态恢复
  localStorage.setItem('current_user', JSON.stringify(user));

  return {
    success: true,
    data: {
      user: { ...user, password: undefined },
      accessToken,
      refreshToken: Mock.Random.string('upper', 32),
      expiresIn: 900
    }
  };
});

Mock.mock('/api/auth/register', 'post', (options) => {
  const userData = JSON.parse(options.body);

  // 检查邮箱是否已存在
  if (users.find(u => u.email === userData.email)) {
    return {
      success: false,
      error: {
        code: 'VALID_005',
        message: '邮箱已存在'
      }
    };
  }

  const newUser = {
    id: users.length + 1,
    username: userData.email.split('@')[0], // 使用邮箱前缀作为用户名
    ...userData,
    role: 'user',
    status: 'active',
    displayName: userData.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);

  return {
    success: true,
    data: { ...newUser, password: undefined }
  };
});

Mock.mock('/api/auth/logout', 'post', () => {
  currentUser = null;
  accessToken = null;
  // 清除localStorage中的用户信息
  localStorage.removeItem('current_user');
  return {
    success: true,
    message: '登出成功'
  };
});

Mock.mock('/api/auth/profile', 'get', () => {
  // 如果当前用户不存在但有token，尝试从localStorage恢复
  if (!currentUser && localStorage.getItem('access_token')) {
    // 从localStorage中获取存储的用户信息或使用默认用户
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (e) {
        // 如果解析失败，使用默认用户
        currentUser = users.find(u => u.username === 'admin') || users[0];
        localStorage.setItem('current_user', JSON.stringify(currentUser));
      }
    } else {
      // 如果没有存储的用户信息，使用默认用户
      currentUser = users.find(u => u.username === 'admin') || users[0];
      localStorage.setItem('current_user', JSON.stringify(currentUser));
    }
  }

  if (!currentUser) {
    return {
      success: false,
      error: {
        code: 'AUTH_001',
        message: '访问令牌无效或已过期'
      }
    };
  }

  return {
    success: true,
    data: { ...currentUser, password: undefined }
  };
});

// 用户管理接口
Mock.mock(/\/api\/users(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 20;
  const search = url.searchParams.get('search') || '';
  const role = url.searchParams.get('role') || '';
  const status = url.searchParams.get('status') || '';

  let filteredUsers = users.filter(user => {
    const matchSearch = !search ||
      user.username.includes(search) ||
      user.email.includes(search) ||
      user.displayName.includes(search);
    const matchRole = !role || user.role === role;
    const matchStatus = !status || user.status === status;

    return matchSearch && matchRole && matchStatus;
  });

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedUsers.map(user => ({ ...user, password: undefined })),
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
});

Mock.mock(/\/api\/users\/(\d+)$/, 'get', (options) => {
  const userId = parseInt(options.url.match(/\/api\/users\/(\d+)$/)[1]);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return {
      success: false,
      error: {
        code: 'RES_001',
        message: '用户不存在'
      }
    };
  }

  return {
    success: true,
    data: { ...user, password: undefined }
  };
});

// 任务管理接口
Mock.mock(/\/api\/tasks(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 20;
  const status = url.searchParams.get('status') || '';
  const priority = url.searchParams.get('priority') || '';
  const search = url.searchParams.get('search') || '';
  const title = url.searchParams.get('title') || '';
  const assigneeId = url.searchParams.get('assigneeId');
  const creatorId = url.searchParams.get('creatorId');

  let filteredTasks = tasks.filter(task => {
    const matchStatus = !status || task.status === status;
    const matchPriority = !priority || task.priority === priority;
    const matchSearch = !search ||
      task.title.includes(search) ||
      task.description.includes(search);
    const matchTitle = !title ||
      task.title.toLowerCase().includes(title.toLowerCase()) ||
      task.description.toLowerCase().includes(title.toLowerCase());
    const matchAssignee = !assigneeId || task.assigneeId === parseInt(assigneeId);
    const matchCreator = !creatorId || task.creatorId === parseInt(creatorId);

    return matchStatus && matchPriority && matchSearch && matchTitle && matchAssignee && matchCreator;
  });

  const total = filteredTasks.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedTasks,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
});

Mock.mock(/\/api\/tasks\/(\d+)$/, 'get', (options) => {
  const taskId = parseInt(options.url.match(/\/api\/tasks\/(\d+)$/)[1]);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return {
      success: false,
      error: {
        code: 'RES_002',
        message: '任务不存在'
      }
    };
  }

  // 添加评论和时间记录
  const taskComments = comments.filter(c => c.taskId === taskId);
  const taskTimeEntries = timeEntries.filter(te => te.taskId === taskId);

  return {
    success: true,
    data: {
      ...task,
      comments: taskComments,
      timeEntries: taskTimeEntries
    }
  };
});

Mock.mock('/api/tasks', 'post', (options) => {
  const taskData = JSON.parse(options.body);

  const newTask = {
    id: tasks.length + 1,
    ...taskData,
    status: 'pending',
    completedAt: null,
    actualHours: 0,
    creatorId: currentUser?.id || 1,
    creator: currentUser || users[0],
    assignee: taskData.assigneeId ? users.find(u => u.id === taskData.assigneeId) : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);

  return {
    success: true,
    data: newTask
  };
});

Mock.mock(/\/api\/tasks\/(\d+)$/, 'put', (options) => {
  const taskId = parseInt(options.url.match(/\/api\/tasks\/(\d+)$/)[1]);
  const updateData = JSON.parse(options.body);

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return {
      success: false,
      error: {
        code: 'RES_002',
        message: '任务不存在'
      }
    };
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updateData,
    assignee: updateData.assigneeId ? users.find(u => u.id === updateData.assigneeId) : tasks[taskIndex].assignee,
    updatedAt: new Date().toISOString()
  };

  return {
    success: true,
    data: tasks[taskIndex]
  };
});

Mock.mock(/\/api\/tasks\/(\d+)\/status$/, 'patch', (options) => {
  const taskId = parseInt(options.url.match(/\/api\/tasks\/(\d+)\/status$/)[1]);
  const { status } = JSON.parse(options.body);

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return {
      success: false,
      error: {
        code: 'RES_002',
        message: '任务不存在'
      }
    };
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();

  if (status === 'completed') {
    tasks[taskIndex].completedAt = new Date().toISOString();
  } else {
    tasks[taskIndex].completedAt = null;
  }

  return {
    success: true,
    data: tasks[taskIndex]
  };
});

Mock.mock(/\/api\/tasks\/(\d+)$/, 'delete', (options) => {
  const taskId = parseInt(options.url.match(/\/api\/tasks\/(\d+)$/)[1]);

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return {
      success: false,
      error: {
        code: 'RES_002',
        message: '任务不存在'
      }
    };
  }

  tasks.splice(taskIndex, 1);

  return {
    success: true,
    message: '任务删除成功'
  };
});

// 任务评论接口
Mock.mock(/\/api\/tasks\/(\d+)\/comments$/, 'get', (options) => {
  const taskId = parseInt(options.url.match(/\/api\/tasks\/(\d+)\/comments$/)[1]);
  const taskComments = comments.filter(c => c.taskId === taskId);

  return {
    success: true,
    data: taskComments
  };
});

Mock.mock(/\/api\/tasks\/(\d+)\/comments$/, 'post', (options) => {
  const taskId = parseInt(options.url.match(/\/api\/tasks\/(\d+)\/comments$/)[1]);
  const { content } = JSON.parse(options.body);

  const newComment = {
    id: comments.length + 1,
    content,
    taskId,
    userId: currentUser?.id || 1,
    user: currentUser || users[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  comments.push(newComment);

  return {
    success: true,
    data: newComment
  };
});

// 时间记录接口
Mock.mock(/\/api\/time-entries(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 20;
  const taskId = url.searchParams.get('taskId');
  const userId = url.searchParams.get('userId');

  let filteredEntries = timeEntries.filter(entry => {
    const matchTask = !taskId || entry.taskId === parseInt(taskId);
    const matchUser = !userId || entry.userId === parseInt(userId);
    return matchTask && matchUser;
  });

  const total = filteredEntries.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedEntries,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
});

Mock.mock('/api/time-entries', 'post', (options) => {
  const entryData = JSON.parse(options.body);

  const newEntry = {
    id: timeEntries.length + 1,
    ...entryData,
    userId: currentUser?.id || 1,
    user: currentUser || users[0],
    task: tasks.find(t => t.id === entryData.taskId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  timeEntries.push(newEntry);

  return {
    success: true,
    data: newEntry
  };
});

// 时间统计接口
Mock.mock(/\/api\/time-entries\/stats(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const userId = url.searchParams.get('userId');
  const period = url.searchParams.get('period') || 'month'; // month, week, day

  // 获取当前日期信息
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  // 筛选时间记录
  let filteredEntries = timeEntries;
  if (userId) {
    filteredEntries = timeEntries.filter(entry => entry.userId === parseInt(userId));
  }

  // 根据期间筛选
  let startDate, endDate;
  switch (period) {
    case 'day':
      startDate = new Date(currentYear, currentMonth, currentDate);
      endDate = new Date(currentYear, currentMonth, currentDate + 1);
      break;
    case 'week':
      const weekStart = currentDate - now.getDay();
      startDate = new Date(currentYear, currentMonth, weekStart);
      endDate = new Date(currentYear, currentMonth, weekStart + 7);
      break;
    case 'month':
    default:
      startDate = new Date(currentYear, currentMonth, 1);
      endDate = new Date(currentYear, currentMonth + 1, 1);
      break;
  }

  filteredEntries = filteredEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate < endDate;
  });

  // 计算统计数据
  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalEntries = filteredEntries.length;
  const daysWorked = new Set(filteredEntries.map(entry => entry.date)).size;

  // 按日期分组统计
  const dailyStats = {};
  filteredEntries.forEach(entry => {
    if (!dailyStats[entry.date]) {
      dailyStats[entry.date] = { hours: 0, entries: 0 };
    }
    dailyStats[entry.date].hours += entry.hours;
    dailyStats[entry.date].entries += 1;
  });

  // 按任务分组统计
  const taskStats = {};
  filteredEntries.forEach(entry => {
    const taskTitle = entry.task?.title || '未知任务';
    if (!taskStats[taskTitle]) {
      taskStats[taskTitle] = { hours: 0, entries: 0 };
    }
    taskStats[taskTitle].hours += entry.hours;
    taskStats[taskTitle].entries += 1;
  });

  // 生成用户特定的示例数据
  const getUserStats = (uid) => {
    const userInfo = users.find(u => u.id === uid) || users[0];

    // 根据不同用户角色生成不同的统计数据
    switch(userInfo.position) {
      case '前端工程师':
        return {
          totalHours: 52.5,
          averageHoursPerDay: 2.6,
          daysWorked: 20,
          totalEntries: 28,
          efficiency: 88,
          topTask: '移动端适配',
          topTaskHours: 12.5,
          dailyBreakdown: [
            { date: '2025-09-09', hours: 4.0, efficiency: 90 },
            { date: '2025-09-10', hours: 2.5, efficiency: 85 },
            { date: '2025-09-11', hours: 3.5, efficiency: 92 },
            { date: '2025-09-12', hours: 6.0, efficiency: 88 },
            { date: '2025-09-13', hours: 4.5, efficiency: 87 }
          ],
          projectBreakdown: [
            { project: '移动端适配', hours: 12.5, percentage: 24 },
            { project: '前端性能优化', hours: 8.0, percentage: 15 },
            { project: '多语言支持', hours: 6.5, percentage: 12 },
            { project: '数据分析仪表板', hours: 5.5, percentage: 10 },
            { project: '其他任务', hours: 20.0, percentage: 39 }
          ]
        };

      case '后端工程师':
        return {
          totalHours: 58.0,
          averageHoursPerDay: 2.9,
          daysWorked: 20,
          totalEntries: 22,
          efficiency: 91,
          topTask: '实现用户认证功能',
          topTaskHours: 15.5,
          dailyBreakdown: [
            { date: '2025-09-09', hours: 3.5, efficiency: 93 },
            { date: '2025-09-10', hours: 4.0, efficiency: 89 },
            { date: '2025-09-11', hours: 2.0, efficiency: 88 },
            { date: '2025-09-12', hours: 5.0, efficiency: 94 },
            { date: '2025-09-13', hours: 6.5, efficiency: 92 }
          ],
          projectBreakdown: [
            { project: '用户认证功能', hours: 15.5, percentage: 27 },
            { project: 'API速率限制', hours: 8.5, percentage: 15 },
            { project: '数据库性能调优', hours: 7.0, percentage: 12 },
            { project: '错误日志监控系统', hours: 6.0, percentage: 10 },
            { project: '其他任务', hours: 21.0, percentage: 36 }
          ]
        };

      case '产品经理':
        return {
          totalHours: 46.5,
          averageHoursPerDay: 2.3,
          daysWorked: 20,
          totalEntries: 31,
          efficiency: 85,
          topTask: '用户反馈收集',
          topTaskHours: 9.5,
          dailyBreakdown: [
            { date: '2025-09-09', hours: 2.5, efficiency: 82 },
            { date: '2025-09-10', hours: 3.0, efficiency: 87 },
            { date: '2025-09-11', hours: 1.5, efficiency: 85 },
            { date: '2025-09-12', hours: 4.5, efficiency: 88 },
            { date: '2025-09-13', hours: 3.0, efficiency: 84 }
          ],
          projectBreakdown: [
            { project: '用户反馈收集', hours: 9.5, percentage: 20 },
            { project: '市场调研报告整理', hours: 8.0, percentage: 17 },
            { project: '产品路线图规划', hours: 7.5, percentage: 16 },
            { project: '客户需求评估', hours: 6.5, percentage: 14 },
            { project: '其他任务', hours: 15.0, percentage: 33 }
          ]
        };

      default:
        return {
          totalHours: totalHours || 45.5,
          averageHoursPerDay: daysWorked > 0 ? (totalHours / daysWorked).toFixed(1) : '2.3',
          daysWorked: daysWorked || 18,
          totalEntries: totalEntries || 25,
          efficiency: 86,
          topTask: Object.keys(taskStats)[0] || '任务管理优化',
          topTaskHours: Object.values(taskStats)[0]?.hours || 8.5,
          dailyBreakdown: Object.entries(dailyStats).map(([date, stats]) => ({
            date,
            hours: stats.hours,
            efficiency: Math.floor(Math.random() * 15) + 80
          })).slice(0, 5),
          projectBreakdown: Object.entries(taskStats).map(([task, stats]) => ({
            project: task,
            hours: stats.hours,
            percentage: Math.round((stats.hours / totalHours) * 100)
          })).slice(0, 5)
        };
    }
  };

  const stats = getUserStats(parseInt(userId) || 1);

  return {
    success: true,
    data: {
      period,
      ...stats,
      summary: {
        totalHours: stats.totalHours,
        workingDays: stats.daysWorked,
        averageDaily: parseFloat(stats.averageHoursPerDay),
        efficiency: stats.efficiency,
        completedTasks: Math.floor(stats.totalHours / 3), // 假设平均每任务3小时
        productivity: stats.efficiency > 85 ? 'high' : stats.efficiency > 75 ? 'medium' : 'low'
      },
      trends: {
        weekOverWeek: Math.floor(Math.random() * 20) - 10, // -10% 到 +10%
        monthOverMonth: Math.floor(Math.random() * 30) - 15, // -15% 到 +15%
        yearOverYear: Math.floor(Math.random() * 50) + 5 // +5% 到 +55%
      }
    }
  };
});

// 归档任务数据
const archivedTasks = [];

// 日历事件数据
const calendarEvents = [
  {
    id: 1,
    title: '每周团队例会',
    start: '2025-09-13T09:00:00',
    end: '2025-09-13T10:00:00',
    type: 'meeting',
    description: '讨论本周任务进度和遇到的问题',
    location: '会议室A',
    attendees: [1, 2, 3, 7],
    taskId: null,
    createdBy: 1,
    createdAt: '2025-09-10T00:00:00.000Z',
    updatedAt: '2025-09-10T00:00:00.000Z'
  },
  {
    id: 2,
    title: '项目演示准备会',
    start: '2025-09-15T14:00:00',
    end: '2025-09-15T16:00:00',
    type: 'presentation',
    description: '准备向客户展示的项目演示材料',
    location: '大会议室',
    attendees: [1, 2, 4, 7],
    taskId: 2,
    createdBy: 4,
    createdAt: '2025-09-10T00:00:00.000Z',
    updatedAt: '2025-09-10T00:00:00.000Z'
  },
  {
    id: 3,
    title: '代码审查会议',
    start: '2025-09-14T15:00:00',
    end: '2025-09-14T16:30:00',
    type: 'review',
    description: '审查本周提交的代码，讨论代码质量问题',
    location: '开发区',
    attendees: [2, 3, 7],
    taskId: 11,
    createdBy: 7,
    createdAt: '2025-09-11T00:00:00.000Z',
    updatedAt: '2025-09-11T00:00:00.000Z'
  },
  {
    id: 4,
    title: '产品需求评审',
    start: '2025-09-16T10:00:00',
    end: '2025-09-16T12:00:00',
    type: 'review',
    description: '评审新功能需求，确定开发计划',
    location: '会议室B',
    attendees: [1, 2, 3, 4, 5, 7],
    taskId: null,
    createdBy: 4,
    createdAt: '2025-09-12T00:00:00.000Z',
    updatedAt: '2025-09-12T00:00:00.000Z'
  },
  {
    id: 5,
    title: '性能测试报告会',
    start: '2025-09-17T16:00:00',
    end: '2025-09-17T17:00:00',
    type: 'presentation',
    description: '分享系统性能测试结果和优化建议',
    location: '技术部',
    attendees: [1, 3, 6, 7],
    taskId: 6,
    createdBy: 6,
    createdAt: '2025-09-13T00:00:00.000Z',
    updatedAt: '2025-09-13T00:00:00.000Z'
  },
  {
    id: 6,
    title: '新人技术培训',
    start: '2025-09-18T14:00:00',
    end: '2025-09-18T17:00:00',
    type: 'training',
    description: '对新员工进行技术栈和开发流程培训',
    location: '培训室',
    attendees: [2, 7, 8],
    taskId: 10,
    createdBy: 7,
    createdAt: '2025-09-15T00:00:00.000Z',
    updatedAt: '2025-09-15T00:00:00.000Z'
  },
  {
    id: 7,
    title: '设计评审会',
    start: '2025-09-19T10:00:00',
    end: '2025-09-19T11:30:00',
    type: 'review',
    description: '评审移动端界面设计稿',
    location: '设计部',
    attendees: [2, 4, 5],
    taskId: 4,
    createdBy: 5,
    createdAt: '2025-09-16T00:00:00.000Z',
    updatedAt: '2025-09-16T00:00:00.000Z'
  },
  {
    id: 8,
    title: '月度总结会议',
    start: '2025-09-30T15:00:00',
    end: '2025-09-30T17:00:00',
    type: 'meeting',
    description: '总结本月工作成果，制定下月计划',
    location: '大会议室',
    attendees: [1, 2, 3, 4, 5, 6, 7, 8],
    taskId: null,
    createdBy: 1,
    createdAt: '2025-09-20T00:00:00.000Z',
    updatedAt: '2025-09-20T00:00:00.000Z'
  },
  {
    id: 9,
    title: '客户反馈讨论会',
    start: '2025-09-21T13:30:00',
    end: '2025-09-21T15:00:00',
    type: 'meeting',
    description: '讨论客户反馈的问题和改进建议',
    location: '会议室C',
    attendees: [1, 4, 5, 7],
    taskId: 7,
    createdBy: 4,
    createdAt: '2025-09-18T00:00:00.000Z',
    updatedAt: '2025-09-18T00:00:00.000Z'
  },
  {
    id: 10,
    title: '技术分享会：监控系统',
    start: '2025-09-25T16:00:00',
    end: '2025-09-25T17:30:00',
    type: 'training',
    description: '分享错误监控系统的实现和最佳实践',
    location: '技术部',
    attendees: [1, 2, 3, 6, 7, 8],
    taskId: 9,
    createdBy: 3,
    createdAt: '2025-09-22T00:00:00.000Z',
    updatedAt: '2025-09-22T00:00:00.000Z'
  }
];

// 四象限分析数据
const quadrantTasks = {
  urgent_important: [], // 重要紧急
  important_not_urgent: [], // 重要不紧急
  urgent_not_important: [], // 紧急不重要
  not_urgent_not_important: [] // 不紧急不重要
};

// 系统设置数据
const systemSettings = {
  general: {
    siteName: '任务管理系统',
    siteDescription: '高效的团队任务管理平台',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h'
  },
  notification: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    taskReminder: true,
    deadlineAlert: true,
    weeklyReport: true
  },
  security: {
    passwordMinLength: 6,
    passwordComplexity: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    twoFactorAuth: false
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    lastBackup: '2025-09-12T02:00:00.000Z'
  }
};

// 日历管理接口
Mock.mock(/\/api\/calendar\/events(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const type = url.searchParams.get('type');

  let filteredEvents = calendarEvents;

  if (start && end) {
    filteredEvents = calendarEvents.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= new Date(start) && eventStart <= new Date(end);
    });
  }

  if (type) {
    filteredEvents = filteredEvents.filter(event => event.type === type);
  }

  return {
    success: true,
    data: filteredEvents
  };
});

Mock.mock('/api/calendar/events', 'post', (options) => {
  const eventData = JSON.parse(options.body);

  const newEvent = {
    id: calendarEvents.length + 1,
    ...eventData,
    createdBy: currentUser?.id || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  calendarEvents.push(newEvent);

  return {
    success: true,
    data: newEvent
  };
});

Mock.mock(/\/api\/calendar\/events\/(\d+)$/, 'put', (options) => {
  const eventId = parseInt(options.url.match(/\/api\/calendar\/events\/(\d+)$/)[1]);
  const eventData = JSON.parse(options.body);

  const eventIndex = calendarEvents.findIndex(e => e.id === eventId);
  if (eventIndex === -1) {
    return {
      success: false,
      error: { code: 'RES_001', message: '事件不存在' }
    };
  }

  calendarEvents[eventIndex] = {
    ...calendarEvents[eventIndex],
    ...eventData,
    updatedAt: new Date().toISOString()
  };

  return {
    success: true,
    data: calendarEvents[eventIndex]
  };
});

Mock.mock(/\/api\/calendar\/events\/(\d+)$/, 'delete', (options) => {
  const eventId = parseInt(options.url.match(/\/api\/calendar\/events\/(\d+)$/)[1]);

  const eventIndex = calendarEvents.findIndex(e => e.id === eventId);
  if (eventIndex === -1) {
    return {
      success: false,
      error: { code: 'RES_001', message: '事件不存在' }
    };
  }

  calendarEvents.splice(eventIndex, 1);

  return {
    success: true,
    message: '删除成功'
  };
});

// 四象限分析接口
Mock.mock('/api/quadrant/analysis', 'get', () => {
  // 根据任务的重要性和紧急性自动分类
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const analysis = {
    urgent_important: [],
    important_not_urgent: [],
    urgent_not_important: [],
    not_urgent_not_important: [],
    archived: [...archivedTasks]
  };

  tasks.filter(task => !task.archived).forEach(task => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isUrgent = dueDate && dueDate <= threeDaysFromNow && task.status !== 'completed';
    const isImportant = task.priority === 'high' || task.priority === 'medium';

    if (isUrgent && isImportant) {
      analysis.urgent_important.push(task);
    } else if (!isUrgent && isImportant) {
      analysis.important_not_urgent.push(task);
    } else if (isUrgent && !isImportant) {
      analysis.urgent_not_important.push(task);
    } else {
      analysis.not_urgent_not_important.push(task);
    }
  });

  return {
    success: true,
    data: analysis
  };
});

Mock.mock('/api/quadrant/move', 'post', (options) => {
  const { taskId, quadrant } = JSON.parse(options.body);

  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return {
      success: false,
      error: { code: 'RES_001', message: '任务不存在' }
    };
  }

  // 根据象限调整任务属性
  switch (quadrant) {
    case 'urgent_important':
      task.priority = 'high';
      task.dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'important_not_urgent':
      task.priority = 'high';
      task.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'urgent_not_important':
      task.priority = 'low';
      task.dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'not_urgent_not_important':
      task.priority = 'low';
      task.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      break;
  }

  task.updatedAt = new Date().toISOString();

  return {
    success: true,
    data: task
  };
});

// 归档任务
Mock.mock('/api/quadrant/archive', 'post', (options) => {
  const { taskId } = JSON.parse(options.body);

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return {
      success: false,
      error: { code: 'RES_001', message: '任务不存在' }
    };
  }

  const task = tasks[taskIndex];
  const archivedTask = {
    ...task,
    archived: true,
    archivedAt: new Date().toISOString()
  };

  // 从原任务列表中移除
  tasks.splice(taskIndex, 1);

  // 添加到归档列表
  archivedTasks.push(archivedTask);

  return {
    success: true,
    data: archivedTask
  };
});

// 取消归档任务
Mock.mock('/api/quadrant/unarchive', 'post', (options) => {
  const { taskId, targetQuadrant } = JSON.parse(options.body);

  const archivedIndex = archivedTasks.findIndex(t => t.id === taskId);
  if (archivedIndex === -1) {
    return {
      success: false,
      error: { code: 'RES_001', message: '归档任务不存在' }
    };
  }

  const archivedTask = archivedTasks[archivedIndex];
  const restoredTask = {
    ...archivedTask,
    archived: false,
    archivedAt: null,
    updatedAt: new Date().toISOString()
  };

  // 根据目标象限调整任务属性
  switch (targetQuadrant) {
    case 'urgent_important':
      restoredTask.priority = 'high';
      restoredTask.dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'important_not_urgent':
      restoredTask.priority = 'high';
      restoredTask.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'urgent_not_important':
      restoredTask.priority = 'low';
      restoredTask.dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'not_urgent_not_important':
      restoredTask.priority = 'low';
      restoredTask.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      break;
  }

  // 从归档列表中移除
  archivedTasks.splice(archivedIndex, 1);

  // 添加回原任务列表
  tasks.push(restoredTask);

  return {
    success: true,
    data: restoredTask
  };
});

// 删除归档任务
Mock.mock(/\/api\/quadrant\/archived\/(\d+)$/, 'delete', (options) => {
  const taskId = parseInt(options.url.match(/\/api\/quadrant\/archived\/(\d+)$/)[1]);

  const archivedIndex = archivedTasks.findIndex(t => t.id === taskId);
  if (archivedIndex === -1) {
    return {
      success: false,
      error: { code: 'RES_001', message: '归档任务不存在' }
    };
  }

  archivedTasks.splice(archivedIndex, 1);

  return {
    success: true,
    message: '任务已永久删除'
  };
});

// 系统管理接口
Mock.mock('/api/system/settings', 'get', () => {
  return {
    success: true,
    data: systemSettings
  };
});

Mock.mock('/api/system/settings', 'put', (options) => {
  const newSettings = JSON.parse(options.body);

  Object.keys(newSettings).forEach(category => {
    if (systemSettings[category]) {
      systemSettings[category] = {
        ...systemSettings[category],
        ...newSettings[category]
      };
    }
  });

  return {
    success: true,
    data: systemSettings
  };
});

Mock.mock('/api/system/backup', 'post', () => {
  systemSettings.backup.lastBackup = new Date().toISOString();

  return {
    success: true,
    data: {
      filename: `backup_${new Date().toISOString().split('T')[0]}.sql`,
      size: '2.5MB',
      createdAt: systemSettings.backup.lastBackup
    }
  };
});

Mock.mock('/api/system/stats', 'get', () => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalEvents = calendarEvents.length;

  return {
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: totalTasks - completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      events: {
        total: totalEvents,
        thisWeek: calendarEvents.filter(e => {
          const eventDate = new Date(e.start);
          const now = new Date();
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          return eventDate >= weekStart && eventDate < weekEnd;
        }).length
      },
      storage: {
        used: '15.2MB',
        total: '100MB',
        usage: 15.2
      }
    }
  };
});

// 导出Mock配置，便于在main.js中导入
export default Mock;