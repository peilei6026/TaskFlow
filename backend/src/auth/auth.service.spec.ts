import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { setupTestDatabase, cleanupDatabase, prisma } from '../../test/setup';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let testUsers: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                JWT_SECRET: 'test-secret',
                JWT_EXPIRES_IN: '15m',
                JWT_REFRESH_EXPIRES_IN: '7d',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    testUsers = await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const result = await service.validateUser('testadmin@example.com', 'password123');

      expect(result).toMatchObject({
        username: 'testadmin',
        email: 'testadmin@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
      });
      expect(result.password).toBeUndefined();
    });

    it('should return null for non-existent user', async () => {
      const result = await service.validateUser('nonexistent@example.com', 'password123');
      expect(result).toBeNull();
    });

    it('should return null for incorrect password', async () => {
      const result = await service.validateUser('testadmin@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      // 创建一个非活跃用户
      const hashedPassword = await bcrypt.hash('password123', 10);
      const inactiveUser = await prisma.user.create({
        data: {
          username: 'inactiveuser',
          email: 'inactive@example.com',
          password: hashedPassword,
          role: 'USER',
          status: 'INACTIVE',
        },
      });

      await expect(
        service.validateUser('inactive@example.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        displayName: '新用户',
      };

      const result = await service.register(registerDto);

      expect(result.user).toMatchObject({
        username: 'newuser',
        email: 'newuser@example.com',
        role: 'USER',
        status: 'ACTIVE',
        displayName: '新用户',
      });
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(900);
    });

    it('should throw ConflictException for duplicate email', async () => {
      const registerDto = {
        username: 'duplicateuser',
        email: 'testadmin@example.com', // 已存在的邮箱
        password: 'password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException for duplicate username', async () => {
      const registerDto = {
        username: 'testadmin', // 已存在的用户名
        email: 'newemail@example.com',
        password: 'password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const loginDto = {
        email: 'testadmin@example.com',
        password: 'password123',
      };

      const result = await service.login(loginDto);

      expect(result.user).toMatchObject({
        username: 'testadmin',
        email: 'testadmin@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
      });
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'testadmin@example.com',
        password: 'wrongpassword',
      };

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile for valid user ID', async () => {
      const result = await service.getUserProfile(testUsers.adminUser.id);

      expect(result).toMatchObject({
        username: 'testadmin',
        email: 'testadmin@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
      });
    });

    it('should throw BadRequestException for non-existent user', async () => {
      await expect(service.getUserProfile(99999)).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // 模拟有效的刷新令牌验证
      (jwtService.verify as jest.Mock).mockReturnValue({
        sub: testUsers.adminUser.id,
        email: testUsers.adminUser.email,
      });

      // 创建一个刷新令牌记录
      const refreshTokenRecord = await prisma.refreshToken.create({
        data: {
          token: 'valid-refresh-token',
          userId: testUsers.adminUser.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
        },
      });

      const result = await service.refreshToken({ refreshToken: 'valid-refresh-token' });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(900);
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refreshToken({ refreshToken: 'invalid-token' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await service.logout('some-refresh-token', testUsers.adminUser.id);
      expect(result.message).toBe('登出成功');
    });
  });
});