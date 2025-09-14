import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus, TaskStatus, TaskPriority, EventType } from '../src/types/enums';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始数据播种...');

  // 清理现有数据
  await prisma.calendarEvent.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // 创建用户
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      displayName: '系统管理员',
      name: '张伟',
      department: '技术部',
      position: '系统管理员',
      phone: '13800138000',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      username: 'john',
      email: 'john@example.com',
      password: hashedPassword,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      displayName: '开发工程师',
      name: '李明',
      department: '技术部',
      position: '前端开发工程师',
      phone: '13800138001',
    },
  });

  const testUser = await prisma.user.create({
    data: {
      username: 'test',
      email: 'test@example.com',
      password: hashedPassword,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      displayName: '测试工程师',
      name: '王芳',
      department: '质量部',
      position: '测试工程师',
      phone: '13800138002',
    },
  });

  console.log('✅ 用户创建完成');

  // 创建任务
  const tasks = [
    {
      title: '修复生产环境bug',
      description: '紧急修复影响用户的关键问题',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6小时后
      assigneeId: regularUser.id,
      creatorId: adminUser.id,
      tags: JSON.stringify(['urgent', 'hotfix']),
      estimatedHours: 4,
    },
    {
      title: '技术架构规划',
      description: '制定下季度的技术发展计划',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 一周后
      assigneeId: adminUser.id,
      creatorId: adminUser.id,
      tags: JSON.stringify(['architecture', 'planning']),
      estimatedHours: 20,
      actualHours: 8,
      progress: 40,
    },
    {
      title: '用户界面优化',
      description: '改进用户体验和界面设计',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
      assigneeId: regularUser.id,
      creatorId: adminUser.id,
      tags: JSON.stringify(['ui', 'frontend']),
      estimatedHours: 12,
      actualHours: 15,
      progress: 100,
    },
    {
      title: '自动化测试框架',
      description: '搭建自动化测试环境',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 两周后
      assigneeId: testUser.id,
      creatorId: adminUser.id,
      tags: JSON.stringify(['testing', 'automation']),
      estimatedHours: 16,
      actualHours: 6,
      progress: 30,
    },
  ];

  const createdTasks = [];
  for (const taskData of tasks) {
    const task = await prisma.task.create({ data: taskData });
    createdTasks.push(task);
  }

  console.log('✅ 任务创建完成');

  // 创建任务评论
  const comments = [
    {
      content: '这个bug影响较大，需要尽快解决',
      taskId: createdTasks[0].id,
      userId: adminUser.id,
    },
    {
      content: '我正在分析问题原因',
      taskId: createdTasks[0].id,
      userId: regularUser.id,
    },
    {
      content: '已完成架构设计文档',
      taskId: createdTasks[1].id,
      userId: adminUser.id,
    },
    {
      content: '测试环境搭建中，预计明天完成基础配置',
      taskId: createdTasks[3].id,
      userId: testUser.id,
    },
  ];

  for (const commentData of comments) {
    await prisma.taskComment.create({ data: commentData });
  }

  console.log('✅ 任务评论创建完成');

  // 创建时间记录
  const timeEntries = [
    {
      description: 'Bug分析和调试',
      hours: 2.5,
      date: new Date(),
      taskId: createdTasks[0].id,
      userId: regularUser.id,
      project: '生产维护',
      billable: true,
    },
    {
      description: '架构设计讨论',
      hours: 4,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 昨天
      taskId: createdTasks[1].id,
      userId: adminUser.id,
      project: '技术规划',
      billable: true,
    },
    {
      description: 'UI设计和实现',
      hours: 8,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 前天
      taskId: createdTasks[2].id,
      userId: regularUser.id,
      project: '前端开发',
      billable: true,
    },
    {
      description: '测试框架研究',
      hours: 3,
      date: new Date(),
      taskId: createdTasks[3].id,
      userId: testUser.id,
      project: '质量保证',
      billable: true,
    },
  ];

  for (const timeEntryData of timeEntries) {
    await prisma.timeEntry.create({ data: timeEntryData });
  }

  console.log('✅ 时间记录创建完成');

  // 创建日历事件
  const calendarEvents = [
    {
      title: '团队周会',
      description: '讨论本周工作进展和下周计划',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 明天+1小时
      type: EventType.MEETING,
      location: '会议室A',
      attendees: JSON.stringify(['admin@example.com', 'john@example.com', 'test@example.com']),
      userId: adminUser.id,
      recurring: true,
    },
    {
      title: '产品发布截止日期',
      description: '新版本功能开发完成',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 一周后
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 一周后
      type: EventType.DEADLINE,
      userId: adminUser.id,
      allDay: true,
    },
    {
      title: '代码审查',
      description: '审查新功能代码',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2小时后
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3小时后
      type: EventType.MEETING,
      location: '线上会议',
      attendees: JSON.stringify(['admin@example.com', 'john@example.com']),
      userId: regularUser.id,
    },
    {
      title: '学习时间',
      description: '学习新技术栈',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3天后
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 3天后+2小时
      type: EventType.PERSONAL,
      userId: testUser.id,
    },
  ];

  for (const eventData of calendarEvents) {
    await prisma.calendarEvent.create({ data: eventData });
  }

  console.log('✅ 日历事件创建完成');
  console.log('🎉 数据播种完成!');
  console.log(`
    创建的用户:
    - 管理员: admin@example.com (密码: password123)
    - 开发者: john@example.com (密码: password123)
    - 测试员: test@example.com (密码: password123)
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });