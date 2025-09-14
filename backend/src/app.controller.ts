import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';
import { AppService } from './app.service';

@ApiTags('应用信息')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取应用信息' })
  @ApiResponse({ status: 200, description: '返回应用基本信息' })
  getAppInfo() {
    return this.appService.getAppInfo();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ status: 200, description: '服务正常运行' })
  getHealth() {
    return this.appService.getHealth();
  }
}