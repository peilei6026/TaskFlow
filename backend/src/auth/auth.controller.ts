import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      example: {
        success: true,
        data: {
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            role: 'ADMIN',
            status: 'ACTIVE',
            displayName: '系统管理员',
            name: '张伟',
            department: '技术部',
            position: '系统管理员',
          },
          accessToken: 'ACCESS_TOKEN_STRING',
          refreshToken: 'REFRESH_TOKEN_STRING',
          expiresIn: 900,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '邮箱或密码错误',
    schema: {
      example: {
        success: false,
        error: {
          code: 'AUTH_003',
          message: '邮箱或密码错误',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: result,
    };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    schema: {
      example: {
        success: true,
        data: {
          user: {
            id: 2,
            username: 'newuser',
            email: 'newuser@example.com',
            role: 'USER',
            status: 'ACTIVE',
            displayName: '新用户',
            name: '李四',
            department: '技术部',
            position: '开发工程师',
          },
          accessToken: 'ACCESS_TOKEN_STRING',
          refreshToken: 'REFRESH_TOKEN_STRING',
          expiresIn: 900,
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '邮箱或用户名已存在',
    schema: {
      example: {
        success: false,
        error: {
          code: 'VALID_005',
          message: '邮箱已被使用',
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      data: result,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponse({
    status: 200,
    description: '令牌刷新成功',
    schema: {
      example: {
        success: true,
        data: {
          accessToken: 'NEW_ACCESS_TOKEN_STRING',
          refreshToken: 'NEW_REFRESH_TOKEN_STRING',
          expiresIn: 900,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '刷新令牌无效',
    schema: {
      example: {
        success: false,
        error: {
          code: 'AUTH_001',
          message: '刷新令牌无效',
        },
      },
    },
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({
    status: 200,
    description: '登出成功',
    schema: {
      example: {
        success: true,
        data: {
          message: '登出成功',
        },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: '刷新令牌',
          example: 'REFRESH_TOKEN_STRING',
        },
      },
    },
  })
  async logout(
    @CurrentUser() user: any,
    @Body() body: { refreshToken?: string },
  ) {
    const result = await this.authService.logout(body.refreshToken, user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取用户信息成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'ADMIN',
          status: 'ACTIVE',
          displayName: '系统管理员',
          name: '张伟',
          department: '技术部',
          position: '系统管理员',
          lastLoginAt: '2024-01-01T12:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  async getProfile(@CurrentUser() user: any) {
    const result = await this.authService.getUserProfile(user.id);
    return {
      success: true,
      data: result,
    };
  }
}