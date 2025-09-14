import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function setupTestDatabase() {
  // 清理测试数据
  await cleanupDatabase();

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      username: 'testadmin',
      email: 'testadmin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      displayName: '测试管理员',
      name: '测试管理员',
      department: '测试部',
      position: '测试管理员',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword,
      role: 'USER',
      status: 'ACTIVE',
      displayName: '测试用户',
      name: '测试用户',
      department: '测试部',
      position: '测试工程师',
    },
  });

  return { adminUser, regularUser };
}

export async function cleanupDatabase() {
  const models = [
    'calendarEvent',
    'timeEntry',
    'taskComment',
    'task',
    'refreshToken',
    'user',
  ];

  for (const model of models) {
    await prisma[model].deleteMany();
  }
}

export { prisma };