import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('日历事件')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('events')
  @ApiOperation({ summary: '创建日历事件' })
  @ApiResponse({ status: 201, description: '事件创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createCalendarEventDto: CreateCalendarEventDto, @Request() req: any) {
    return this.calendarService.create(createCalendarEventDto, req.user.id);
  }

  @Get('events')
  @ApiOperation({ summary: '获取日历事件列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期过滤' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期过滤' })
  findAll(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.calendarService.findAll(req.user.id, startDate, endDate);
  }

  @Get('events/month/:year/:month')
  @ApiOperation({ summary: '按月获取日历事件' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  findByMonth(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Request() req: any,
  ) {
    return this.calendarService.findByMonth(year, month, req.user.id);
  }

  @Get('events/:id')
  @ApiOperation({ summary: '获取单个日历事件' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '事件不存在' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.calendarService.findOne(id, req.user.userId);
  }

  @Patch('events/:id')
  @ApiOperation({ summary: '更新日历事件' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '事件不存在' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalendarEventDto: UpdateCalendarEventDto,
    @Request() req: any,
  ) {
    return this.calendarService.update(id, updateCalendarEventDto, req.user.userId);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: '删除日历事件' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '事件不存在' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.calendarService.remove(id, req.user.userId);
  }
}