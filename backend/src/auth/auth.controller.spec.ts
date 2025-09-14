import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { setupTestDatabase, cleanupDatabase, prisma } from '../../test/setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let testUsers: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    testUsers = await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        displayName: '新用户',
        name: '新用户',
        department: '技术部',
        position: '开发工程师',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        username: 'newuser',
        email: 'newuser@example.com',
        role: 'USER',
        status: 'ACTIVE',
        displayName: '新用户',
        name: '新用户',
        department: '技术部',
        position: '开发工程师',
      });
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.expiresIn).toBe(900);
    });

    it('should fail with duplicate email', async () => {
      const registerDto = {
        username: 'duplicateuser',
        email: 'testadmin@example.com', // 已存在的邮箱
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('邮箱已被使用');
    });

    it('should fail with invalid email format', async () => {
      const registerDto = {
        username: 'invaliduser',
        email: 'invalid-email',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail with short password', async () => {
      const registerDto = {
        username: 'shortpassuser',
        email: 'shortpass@example.com',
        password: '123', // 密码太短
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const loginDto = {
        email: 'testadmin@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        username: 'testadmin',
        email: 'testadmin@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
      });
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should fail with incorrect email', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('邮箱或密码错误');
    });

    it('should fail with incorrect password', async () => {
      const loginDto = {
        email: 'testadmin@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('邮箱或密码错误');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // 首先登录获取令牌
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testadmin@example.com',
          password: 'password123',
        });

      const refreshToken = loginResponse.body.data.refreshToken;

      // 刷新令牌
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.expiresIn).toBe(900);
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('刷新令牌无效');
    });
  });

  describe('GET /auth/profile', () => {
    it('should get user profile successfully with valid token', async () => {
      // 首先登录获取令牌
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testadmin@example.com',
          password: 'password123',
        });

      const accessToken = loginResponse.body.data.accessToken;

      // 获取用户信息
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        username: 'testadmin',
        email: 'testadmin@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        displayName: '测试管理员',
      });
    });

    it('should fail without authorization token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      // 首先登录获取令牌
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testadmin@example.com',
          password: 'password123',
        });

      const accessToken = loginResponse.body.data.accessToken;
      const refreshToken = loginResponse.body.data.refreshToken;

      // 登出
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('登出成功');
    });

    it('should fail without authorization token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ refreshToken: 'some-token' })
        .expect(401);
    });
  });
});